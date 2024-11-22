import { Request, Response } from "express";

export async function register_webhook(
  req: Request,
  res: Response
): Promise<any> {
  const { Octokit } = await import("octokit");

  const { repo, owner, access_token } = req.body;
  const webhook_secret = process.env.WEBHOOK_SECRET;
  const baseUrl = process.env.BASE_URL;

  console.log("Registering webhook for =>", owner, repo);
  console.log("Webhook base url =>", baseUrl);

  try {
    const octokit = new Octokit({
      auth: access_token,
    });

    await octokit.request("POST /repos/{owner}/{repo}/hooks", {
      owner: owner,
      repo: repo,
      name: "web",
      active: true,
      events: ["pull_request"],
      config: {
        url: `${baseUrl}/api/v1-2024/webhook/pr_event`,
        content_type: "json",
        secret: webhook_secret,
        insecure_ssl: "0",
      },
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    return res.status(200).json({ message: "Webhook registered successfully" });
  } catch (error) {
    console.error("Error occurred while registering webhook =>", error);
    return res
      .status(500)
      .json({ message: "Error occurred while registering webhook" });
  }
}


export const repositories = async (req: Request, res: Response): Promise<any> => {
  const { Octokit } = await import("octokit");
  const accessToken = req.body.access_token;
  const userName = req.body.user_name;

  if (!accessToken) {
      return res.status(401).json({ error: 'Unauthorized: Missing access token' });
  }

  const octokit = new Octokit({
      auth: accessToken,
  });

  try {
      
      const response = await octokit.request('GET /users/{username}/repos', {
        username: userName,
          headers: {
              'X-GitHub-Api-Version': '2022-11-28',
          },
          
      });
      const repositories = response.data.map((repo: any) => ({
          id: repo.id,
          name: repo.name,
          full_name: repo.full_name,
          description: repo.description,
          private: repo.private,
          html_url: repo.html_url,
          language: repo.language,
          created_at: repo.created_at,
          updated_at: repo.updated_at,
      }));

      res.json(repositories);
  } catch (error: any) {
      console.error('Error fetching user repositories:', error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to fetch user repositories' });
  }
};

