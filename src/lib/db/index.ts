import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "3306"),
      user: process.env.DB_USER || "",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "",
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
  }
  return pool;
}

export async function query<T>(sql: string, params?: (string | number | boolean | null)[]): Promise<T> {
  const db = getPool();
  const [rows] = await db.execute(sql, params ?? []);
  return rows as T;
}

export function isDbConfigured(): boolean {
  return !!(process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME);
}
