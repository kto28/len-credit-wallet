import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

interface UserRow {
  id: number;
  email: string;
}

export async function POST(req: NextRequest) {
  try {
    const { email, mobile } = await req.json();

    if (!email || !mobile) {
      return NextResponse.json({ error: "Email and mobile required" }, { status: 400 });
    }

    // Check if user exists
    const users = await query<UserRow[]>(
      "SELECT id, email FROM users WHERE email = ? AND mobile = ?",
      [email, mobile]
    );

    if (users.length === 0) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Generate 6-digit OTP
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Invalidate previous unused OTPs for this email
    await query(
      "UPDATE otp_codes SET used = TRUE WHERE email = ? AND used = FALSE",
      [email]
    );

    // Store OTP
    await query(
      "INSERT INTO otp_codes (email, mobile, code, expires_at) VALUES (?, ?, ?, ?)",
      [email, mobile, code, expiresAt.toISOString().slice(0, 19).replace("T", " ")]
    );

    // Send OTP via Brevo
    const brevoKey = process.env.BREVO_API_KEY;
    if (!brevoKey) {
      console.error("BREVO_API_KEY not configured");
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }

    const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": brevoKey,
      },
      body: JSON.stringify({
        sender: { name: "LEN Credit Wallet", email: "noreply@eddyto.com" },
        to: [{ email }],
        subject: "Your LEN Wallet Login Code",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="background: #0B1F3A; width: 50px; height: 50px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center;">
                <span style="color: #D4A853; font-weight: bold; font-size: 20px;">L</span>
              </div>
              <h2 style="color: #0B1F3A; margin-top: 15px;">LEN Credit Wallet</h2>
            </div>
            <p style="color: #333; font-size: 14px;">Your verification code is:</p>
            <div style="background: #f5f5f5; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #0B1F3A;">${code}</span>
            </div>
            <p style="color: #888; font-size: 12px;">This code expires in 5 minutes. Do not share it with anyone.</p>
          </div>
        `,
      }),
    });

    if (!brevoRes.ok) {
      const errBody = await brevoRes.text();
      console.error("Brevo error:", errBody);
      return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: "OTP sent to your email" });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
