import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const sessionId = req.cookies.get("session")?.value;
    if (sessionId) {
      await query("DELETE FROM sessions WHERE id = ?", [sessionId]);
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set("session", "", { expires: new Date(0), path: "/" });
    return response;
  } catch {
    return NextResponse.json({ ok: true });
  }
}
