import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

interface TxRow {
  id: number;
  title: string;
  amount: number;
  type: string;
  status: string;
  created_at: string;
}

interface SessionRow {
  user_id: number;
}

async function getUserId(req: NextRequest): Promise<number | null> {
  const sessionId = req.cookies.get("session")?.value;
  if (!sessionId) return null;
  const rows = await query<SessionRow[]>(
    "SELECT user_id FROM sessions WHERE id = ? AND expires_at > NOW()",
    [sessionId]
  );
  return rows.length > 0 ? rows[0].user_id : null;
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rows = await query<TxRow[]>(
      "SELECT id, title, amount, type, status, created_at FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50",
      [userId]
    );

    return NextResponse.json({ transactions: rows.map((t) => ({
      id: t.id,
      title: t.title,
      amount: Number(t.amount),
      type: t.type,
      status: t.status,
      date: t.created_at,
    })) });
  } catch (error) {
    console.error("Transactions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { merchant, amount } = await req.json();
    if (!merchant || !amount) {
      return NextResponse.json({ error: "merchant and amount required" }, { status: 400 });
    }

    // Insert transaction
    await query(
      "INSERT INTO transactions (user_id, title, amount, type, status) VALUES (?, ?, ?, 'used', 'completed')",
      [userId, merchant, -Math.abs(amount)]
    );

    // Update wallet
    await query(
      "UPDATE wallets SET balance = balance - ?, total_used = total_used + ? WHERE user_id = ?",
      [Math.abs(amount), Math.abs(amount), userId]
    );

    // Add notification
    await query(
      "INSERT INTO notifications (user_id, title, description, icon_type, unread) VALUES (?, 'Payment Sent', ?, 'credit', TRUE)",
      [userId, `HKD ${amount} credit used at ${merchant}`]
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
