import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

interface SettlementRow {
  id: number;
  merchant: string;
  period: string;
  redeemed: string;
  amount: string;
  status: string;
}

export async function GET() {
  try {
    const rows = await query<SettlementRow[]>(
      "SELECT id, merchant, period, redeemed, amount, status FROM settlements ORDER BY created_at DESC"
    );

    return NextResponse.json({ settlements: rows });
  } catch (error) {
    console.error("Settlements error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Approve a settlement
export async function PATCH(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    await query("UPDATE settlements SET status = 'Approved' WHERE id = ? AND status = 'Pending'", [id]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Settlement approve error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
