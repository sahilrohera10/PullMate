import { Pool, PoolClient, QueryResult } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const dbPool: Pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
  ssl: true,
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
