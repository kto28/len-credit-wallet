import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

interface SessionRow {
  user_id: number;
  name: string;
  initials: string;
  mobile: string;
  email: string;
  membership_tier: string;
  role: string;
}

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.cookies.get("session")?.value;
    if (!sessionId) {
      return NextResponse.json({ user: null });
    }

    const rows = await query<SessionRow[]>(
      `SELECT u.id as user_id, u.name, u.initials, u.mobile, u.email, u.membership_tier, u.role
       FROM sessions s JOIN users u ON s.user_id = u.id
       WHERE s.id = ? AND s.expires_at > NOW()`,
      [sessionId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ user: null });
    }

    const r = rows[0];
    return NextResponse.json({
      user: {
        id: r.user_id,
        name: r.name,
        initials: r.initials,
        mobile: r.mobile,
        email: r.email,
        membershipTier: r.membership_tier,
        role: r.role,
      },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
