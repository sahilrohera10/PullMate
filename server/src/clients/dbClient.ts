import { Pool, PoolClient, QueryResult } from "pg";
import dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

// connecting using db credentials
// export const dbPool: Pool = new Pool({
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT),
//   database: process.env.DB_NAME,
//   ssl: { rejectUnauthorized: false },
// });

// connecting using connection string
export const dbPool: Pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

/**
 * Function to test and initialize the database connection.
 * Logs success or failure during app startup.
 */
export const connectToDB = async (): Promise<void> => {
  try {
    const client: PoolClient = await dbPool.connect();
    console.log("✅ Database connected successfully!");
    client.release();
  } catch (error) {
    console.error(
      "❌ Failed to connect to the database:",
      (error as Error).message
    );
    process.exit(1);
  }
};

/**
 * Helper function to execute a database query.
 * @param queryText - The SQL query string
 * @param params - Optional query parameters
 * @returns QueryResult<T> - The query result with a generic type for rows
 */
export const executeQuery = async (queryText: string, params: any[] = []) => {
  try {
    const result = await dbPool.query(queryText, params);
    return result;
  } catch (error) {
    console.error("❌ Database query error:", (error as Error).message);
    throw error;
  }
};
