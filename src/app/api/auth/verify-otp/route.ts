import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import crypto from "crypto";

interface OtpRow {
  id: number;
  email: string;
  mobile: string;
}

interface UserRow {
  id: number;
  name: string;
  initials: string;
  mobile: string;
  email: string;
  membership_tier: string;
  role: string;
}

export async function POST(req: NextRequest) {
  try {
    const { email, mobile, code } = await req.json();

    if (!email || !mobile || !code) {
      return NextResponse.json({ error: "Email, mobile and code required" }, { status: 400 });
    }

    // Verify OTP
    const otps = await query<OtpRow[]>(
      "SELECT id, email, mobile FROM otp_codes WHERE email = ? AND mobile = ? AND code = ? AND used = FALSE AND expires_at > NOW()",
      [email, mobile, code]
    );

    if (otps.length === 0) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 401 });
    }

    // Mark OTP as used
    await query("UPDATE otp_codes SET used = TRUE WHERE id = ?", [otps[0].id]);

    // Get user
    const users = await query<UserRow[]>(
      "SELECT id, name, initials, mobile, email, membership_tier, role FROM users WHERE email = ? AND mobile = ?",
      [email, mobile]
    );

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = users[0];

    // Create session
    const sessionId = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await query(
      "INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)",
      [sessionId, user.id, expiresAt.toISOString().slice(0, 19).replace("T", " ")]
    );

    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        initials: user.initials,
        mobile: user.mobile,
        email: user.email,
        membershipTier: user.membership_tier,
        role: user.role,
      },
    });

    response.cookies.set("session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
