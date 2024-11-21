import { Request, Response } from "express";
import { Octokit } from "octokit";

export async function register_webhook(req: Request, res: Response) {
  // logic that registers a webhook for a repository

  try {
    const octokit = new Octokit({
      auth: "YOUR-TOKEN",
    });

    await octokit.request("POST /repos/{owner}/{repo}/hooks", {
      owner: "OWNER",
      repo: "REPO",
      name: "web",
      active: true,
      events: ["push", "pull_request"],
      config: {
        url: "https://example.com/webhook",
        content_type: "json",
        insecure_ssl: "0",
      },
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
  } catch (error) {}
}
