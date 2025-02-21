import { executeQuery } from "../clients";

export async function insert_workflow(workflow_info: (string | null)[]) {
  const query = `
    INSERT INTO workflows (workflow_id, repo_name, repo_url, user_id, owner_name, additional_email, no_of_prs, no_of_reviews, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
  `;

  try {
    const response = await executeQuery(query, workflow_info);

    return response.rows[0];
  } catch (error) {
    console.error("Error during insert_user:", error);
    throw error;
  }
}
export async function get_user_workflows(user_id: string ){
  const query = `
    SELECT * FROM workflows WHERE user_id = $1  ORDER BY created_at DESC;
  `;

  try {
    const response = await executeQuery(query, [user_id]);
    return response.rows;
  }
   catch (error) {
    console.error("Error fetching workflows:", error);
    throw error;
  }
}