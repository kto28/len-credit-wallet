import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

interface NotifRow {
  id: number;
  title: string;
  description: string;
  icon_type: string;
  unread: number;
  created_at: string;
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

    const rows = await query<NotifRow[]>(
      "SELECT id, title, description, icon_type, unread, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50",
      [userId]
    );

    return NextResponse.json({ notifications: rows.map((n) => ({
      id: n.id,
      title: n.title,
      desc: n.description,
      iconType: n.icon_type,
      unread: !!n.unread,
      time: n.created_at,
    })) });
  } catch (error) {
    console.error("Notifications error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Mark notification(s) as read
export async function PATCH(req: NextRequest) {
  try {
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, all } = await req.json();

    if (all) {
      await query("UPDATE notifications SET unread = FALSE WHERE user_id = ?", [userId]);
    } else if (id) {
      await query("UPDATE notifications SET unread = FALSE WHERE id = ? AND user_id = ?", [id, userId]);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Notifications patch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
