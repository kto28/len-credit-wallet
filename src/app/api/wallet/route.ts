import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

interface WalletRow {
  balance: number;
  total_earned: number;
  total_used: number;
  expiry: string;
  renewal_status: string;
  loyalty_credit: string;
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

    const rows = await query<WalletRow[]>(
      "SELECT balance, total_earned, total_used, expiry, renewal_status, loyalty_credit FROM wallets WHERE user_id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ wallet: null });
    }

    const w = rows[0];
    return NextResponse.json({
      wallet: {
        balance: Number(w.balance),
        totalEarned: Number(w.total_earned),
        totalUsed: Number(w.total_used),
        expiry: w.expiry,
        renewalStatus: w.renewal_status,
        loyaltyCredit: w.loyalty_credit,
      },
    });
  } catch (error) {
    console.error("Wallet error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
