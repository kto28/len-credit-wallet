import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { secret, action } = await req.json();
    if (secret !== "len-setup-2026") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Debug: query any data
    if (action === "query") {
      const { sql } = await req.json().catch(() => ({ sql: "" }));
      return NextResponse.json({ error: "Use dedicated actions" });
    }

    // Check all wallets
    if (action === "check") {
      const users = await query<{ id: number; name: string; email: string }[]>("SELECT id, name, email FROM users");
      const wallets = await query<{ user_id: number; balance: number }[]>("SELECT user_id, balance FROM wallets");
      const members = await query<{ id: number; name: string; email: string }[]>("SELECT id, name, email FROM members");
      return NextResponse.json({ users, wallets, members });
    }

    // Fix Eddy To wallet
    if (action === "fix-eddy") {
      const eddy = await query<{ id: number }[]>("SELECT id FROM users WHERE email = 'eddyto@gmail.com'");
      if (eddy.length === 0) return NextResponse.json({ error: "Eddy not found" });
      const eddyId = eddy[0].id;
      
      // Ensure wallet exists
      const w = await query<{ user_id: number }[]>("SELECT user_id FROM wallets WHERE user_id = ?", [eddyId]);
      if (w.length === 0) {
        await query("INSERT INTO wallets (user_id, balance, total_earned, total_used, expiry, renewal_status, loyalty_credit) VALUES (?, 192, 192, 0, '28 Oct 2027', 'First Renewal', '5% Silver')", [eddyId]);
      } else {
        await query("UPDATE wallets SET balance = 192, total_earned = 192, total_used = 0, expiry = '28 Oct 2027', renewal_status = 'First Renewal', loyalty_credit = '5% Silver' WHERE user_id = ?", [eddyId]);
      }
      // Update user tier
      await query("UPDATE users SET membership_tier = 'Silver' WHERE id = ?", [eddyId]);
      return NextResponse.json({ message: "Eddy wallet fixed", userId: eddyId });
    }

    // Fix Jenny Tse wallet + member
    if (action === "fix-jenny") {
      const jenny = await query<{ id: number }[]>("SELECT id FROM users WHERE email = 'jennytse@multivation.com.hk'");
      if (jenny.length === 0) return NextResponse.json({ error: "Jenny not found" });
      const jennyId = jenny[0].id;

      const w = await query<{ user_id: number }[]>("SELECT user_id FROM wallets WHERE user_id = ?", [jennyId]);
      if (w.length === 0) {
        await query("INSERT INTO wallets (user_id, balance, total_earned, total_used, expiry, renewal_status, loyalty_credit) VALUES (?, 192, 192, 0, '28 Oct 2027', 'First Renewal', '5% Silver')", [jennyId]);
      } else {
        await query("UPDATE wallets SET balance = 192, total_earned = 192, total_used = 0, expiry = '28 Oct 2027', renewal_status = 'First Renewal', loyalty_credit = '5% Silver' WHERE user_id = ?", [jennyId]);
      }

      // Update user tier
      await query("UPDATE users SET membership_tier = 'Silver' WHERE id = ?", [jennyId]);

      return NextResponse.json({ message: "Jenny wallet fixed", userId: jennyId });
    }

    // Add join_date and chapter columns to members table
    if (action === "migrate-members") {
      try {
        await query("ALTER TABLE members ADD COLUMN join_date DATE DEFAULT NULL");
      } catch { /* column may already exist */ }
      try {
        await query("ALTER TABLE members ADD COLUMN chapter VARCHAR(50) DEFAULT 'Wisdom'");
      } catch { /* column may already exist */ }
      // Set all existing members to Wisdom chapter
      await query("UPDATE members SET chapter = 'Wisdom' WHERE chapter IS NULL OR chapter = ''");
      return NextResponse.json({ message: "Members table migrated: join_date + chapter added" });
    }

    return NextResponse.json({ error: "Unknown action. Use: check, fix-eddy, fix-jenny, migrate-members" });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
