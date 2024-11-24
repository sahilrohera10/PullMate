import { executeQuery } from "../clients";

export async function insert_user(user_info: (string | null)[]) {
  const query = `
    INSERT INTO user_details (user_id, name, avatar, location, email, bio, user_name)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;

  try {
    const response = await executeQuery(query, user_info);

    return response.rows[0];
  } catch (error) {
    console.error("Error during insert_user:", error);
    throw error;
  }
}
