import { NextResponse } from "next/server";
import { query } from "@/lib/db";

interface MemberRow {
  id: number;
  name: string;
  business: string;
  photo: string;
  phone: string | null;
  whatsapp: string | null;
  website: string | null;
  join_date: string | null;
  chapter: string | null;
}

export async function GET() {
  try {
    const rows = await query<MemberRow[]>(
      "SELECT id, name, business, photo, phone, whatsapp, website, join_date, chapter FROM members ORDER BY name"
    );

    return NextResponse.json({ members: rows.map((m) => ({
      id: m.id,
      name: m.name,
      business: m.business,
      photo: m.photo,
      phone: m.phone || undefined,
      whatsapp: m.whatsapp || undefined,
      website: m.website || undefined,
      joinDate: m.join_date || undefined,
      chapter: m.chapter || undefined,
    })) });
  } catch (error) {
    console.error("Members error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
