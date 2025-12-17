import mysql from "mysql2/promise";
import type { Pool, PoolConnection, RowDataPacket } from "mysql2/promise";

let pool: Pool | null = null;

const getPool = (): Pool => {
  if (!pool) {
    pool = mysql.createPool({
      host: import.meta.env.DB_HOST || "localhost",
      port: parseInt(import.meta.env.DB_PORT || "3306"),
      user: import.meta.env.DB_USERNAME,
      password: import.meta.env.DB_PASSWORD,
      database: import.meta.env.DB_DATABASE,

      waitForConnections: true,
      connectionLimit: 5,
      maxIdle: 5,
      idleTimeout: 60000,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,

      namedPlaceholders: true,

      timezone: "Z",

      charset: "utf8mb4",
    });
  }
  return pool;
};

export const TABLES = {
  bans: "litebans_bans",
  mutes: "litebans_mutes",
  warnings: "litebans_warnings",
  kicks: "litebans_kicks",
  history: "litebans_history",
  config: "litebans_config",
  servers: "litebans_servers",
} as const;

export type TableName = keyof typeof TABLES;

/**
 * Execute a prepared statement query
 * Uses prepared statements for security and performance
 */
export async function query<T extends RowDataPacket[]>(
  sql: string,
  params: Record<string, unknown> = {}
): Promise<T> {
  const pool = getPool();

  try {
    const [rows] = await pool.execute<T>(sql, params);
    return rows;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

/**
 * Execute a simple query without parameters
 */
export async function simpleQuery<T extends RowDataPacket[]>(
  sql: string
): Promise<T> {
  const pool = getPool();

  try {
    const [rows] = await pool.query<T>(sql);
    return rows;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

/**
 * Get a connection from the pool for transactions
 */
export async function getConnection(): Promise<PoolConnection> {
  const pool = getPool();
  return pool.getConnection();
}

/**
 * Close the pool (for cleanup)
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

export { getPool };
