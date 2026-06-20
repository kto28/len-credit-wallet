import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import crypto from "crypto";

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
    const { email, mobile, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const passwordHash = crypto.createHash("sha256").update(password).digest("hex");

    const users = await query<UserRow[]>(
      "SELECT id, name, initials, mobile, email, membership_tier, role FROM users WHERE email = ? AND password_hash = ?",
      [email, passwordHash]
    );

    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
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
        mobile: user.mobile || mobile,
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
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
