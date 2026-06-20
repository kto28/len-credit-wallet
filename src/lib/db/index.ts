/* eslint-disable @typescript-eslint/no-explicit-any */

let pool: any = null;

async function getPool() {
  if (!pool) {
    const mysql = await import("mysql2/promise");
    pool = mysql.createPool({
      host: process.env.DB_HOST || "127.0.0.1",
      port: parseInt(process.env.DB_PORT || "3306"),
      user: process.env.DB_USER || "",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "",
      waitForConnections: true,
      connectionLimit: 3,
      queueLimit: 0,
      connectTimeout: 2000,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
  }
  return pool;
}

export async function query<T>(sql: string, params?: (string | number | boolean | null)[]): Promise<T> {
  try {
    const db = await getPool();
    const [rows] = await db.execute(sql, params ?? []);
    return rows as T;
  } catch (error) {
    console.error("DB query error:", error);
    throw error;
  }
}

export function isDbConfigured(): boolean {
  return !!(process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME);
}
