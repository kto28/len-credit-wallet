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
        await query("INSERT INTO wallets (user_id, balance, total_earned, total_used, expiry, renewal_status, loyalty_credit) VALUES (?, 1500, 2500, 1000, '28 Oct 2027', 'Second Renewal', '10% Loyalty Credit')", [eddyId]);
      } else {
        await query("UPDATE wallets SET balance = 1500, total_earned = 2500, total_used = 1000, expiry = '28 Oct 2027', renewal_status = 'Second Renewal', loyalty_credit = '10% Loyalty Credit' WHERE user_id = ?", [eddyId]);
      }
      return NextResponse.json({ message: "Eddy wallet fixed", userId: eddyId });
    }

    // Add Jenny Tse member record
    if (action === "fix-jenny-member") {
      // Update or insert Jenny in members
      const existing = await query<{ id: number }[]>("SELECT id FROM members WHERE name = 'Jenny Tse'");
      if (existing.length > 0) {
        await query("UPDATE members SET email = 'jennytse@multivation.com.hk', phone = '67487062', company = 'Multivation', role = 'Director', tier = 'Gold', whatsapp = '85267487062', website = 'https://www.multivation.com.hk' WHERE name = 'Jenny Tse'");
      } else {
        await query("INSERT INTO members (name, initials, email, phone, company, role, tier, whatsapp, website) VALUES ('Jenny Tse', 'JT', 'jennytse@multivation.com.hk', '67487062', 'Multivation', 'Director', 'Gold', '85267487062', 'https://www.multivation.com.hk')");
      }
      return NextResponse.json({ message: "Jenny member record updated" });
    }

    return NextResponse.json({ error: "Unknown action. Use: check, fix-eddy, fix-jenny-member" });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
