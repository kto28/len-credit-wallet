import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { secret } = await req.json();
    if (secret !== "len-setup-2026") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update Jenny Tse in members
    await query(
      "UPDATE members SET phone = '67487062', whatsapp = '85267487062', website = 'https://www.multivation.com.hk' WHERE name = 'Jenny Tse'"
    );

    // Check if user already exists
    const existing = await query<{ id: number }[]>(
      "SELECT id FROM users WHERE email = 'jennytse@multivation.com.hk'"
    );

    if (existing.length > 0) {
      return NextResponse.json({ message: "Jenny Tse already exists", id: existing[0].id });
    }

    // Create user
    await query(
      "INSERT INTO users (name, initials, mobile, email, password_hash, membership_tier, role) VALUES ('Jenny Tse', 'JT', '67487062', 'jennytse@multivation.com.hk', SHA2('123456', 256), 'Gold Member', 'member')"
    );

    const newUser = await query<{ id: number }[]>("SELECT LAST_INSERT_ID() as id");
    const userId = newUser[0].id;

    // Wallet
    await query(
      "INSERT INTO wallets (user_id, balance, total_earned, total_used, expiry, renewal_status, loyalty_credit) VALUES (?, 500, 800, 300, '28 Oct 2027', 'Second Renewal', '10% Loyalty Credit')",
      [userId]
    );

    // Transactions
    await query(
      "INSERT INTO transactions (user_id, title, amount, type, status, created_at) VALUES (?, 'LEN Renewal Credit', 500, 'earned', 'completed', NOW() - INTERVAL 3 DAY), (?, 'Welcome Bonus', 100, 'earned', 'completed', NOW() - INTERVAL 10 DAY), (?, 'Referral Bonus', 200, 'earned', 'completed', NOW() - INTERVAL 20 DAY), (?, 'ABC Design Studio', -150, 'used', 'completed', NOW() - INTERVAL 2 DAY), (?, 'XYZ Photography', -150, 'used', 'completed', NOW() - INTERVAL 8 DAY)",
      [userId, userId, userId, userId, userId]
    );

    // Notifications
    await query(
      "INSERT INTO notifications (user_id, title, description, icon_type, unread, created_at) VALUES (?, 'Credit Issued', 'HKD 500 renewal credit added to your wallet', 'credit', TRUE, NOW() - INTERVAL 3 HOUR), (?, 'Payment Confirmed', 'HKD 150 credit used at ABC Design Studio', 'success', TRUE, NOW() - INTERVAL 2 DAY)",
      [userId, userId]
    );

    return NextResponse.json({ message: "Jenny Tse created", id: userId });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
