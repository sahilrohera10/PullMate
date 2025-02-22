import { Request, Response } from "express";
import { v4 } from "uuid";
import { insert_workflow } from "../services/workflow";
import Joi from "joi";
import {
  repositoriesSchema,
  webhookSchema,
} from "../validations/github.validations";

export async function register_webhook(
  req: Request,
  res: Response
): Promise<any> {
  const { Octokit } = await import("octokit");

  console.log("hi there");

  console.log("hi there");

  const { error } = webhookSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: " validation error",
      error: error.details.map((err) => err.message),
    });
  }
  const { repo, owner, access_token, repo_url, user_id, additional_email } =
    req.body;
  const webhook_secret = process.env.WEBHOOK_SECRET;
  const baseUrl = process.env.BASE_URL;

  try {
    console.log("i am in try");
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

    // insert the workspace details into the database

    const workflow_info_query = [
      v4(),
      repo,
      repo_url,
      user_id,
      owner,
      additional_email,
      new Date().toISOString(),
    ];

    const workflow_response = await insert_workflow(workflow_info_query);

    return res.status(200).json({
      message: "Webhook registered successfully and workflow added in db",
      workflow_response,
    });
  } catch (error) {
    console.error("Error occurred while registering webhook =>", error);
    return res
      .status(500)
      .json({ message: "Error occurred while registering webhook" });
  }
}

export const repositories = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { error } = repositoriesSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation error",
      error: error.details.map((err) => err.message),
    });
  }
  const { Octokit } = await import("octokit");
  const accessToken = req.body.access_token;
  const userName = req.body.user_name;
  const {
    type = "owner",
    sort = "pushed",
    direction = "desc",
    per_page = 30,
    page = 1,
  } = req.body;

  if (!accessToken) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Missing access token" });
  }

  const octokit = new Octokit({
    auth: accessToken,
  });

  try {
    const response = await octokit.request("GET /users/{username}/repos", {
      username: userName,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
      type,
      sort,
      direction,
      per_page,
      page,
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
    console.error(
      "Error fetching user repositories:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch user repositories" });
  }
};
