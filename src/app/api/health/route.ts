import { NextResponse } from "next/server";
import { query, isDbConfigured } from "@/lib/db";

export async function GET() {
  const status: Record<string, unknown> = {
    time: new Date().toISOString(),
    dbConfigured: isDbConfigured(),
    dbHost: process.env.DB_HOST || "(not set)",
    dbUser: process.env.DB_USER || "(not set)",
    dbName: process.env.DB_NAME || "(not set)",
    brevoKey: process.env.BREVO_API_KEY ? "set (" + process.env.BREVO_API_KEY.slice(0, 10) + "...)" : "(not set)",
  };

  if (isDbConfigured()) {
    try {
      const rows = await query<{ cnt: number }[]>("SELECT 1 as cnt");
      status.dbConnection = "OK";
      status.dbResult = rows;
    } catch (err) {
      status.dbConnection = "FAILED";
      status.dbError = String(err);
    }
  }

  return NextResponse.json(status);
}
