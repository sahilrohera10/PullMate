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
