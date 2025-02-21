import { Request, Response } from "express";
import { verifyGitHubWebhookSignature } from "../utils/github_services";
import Logger from "../lib/logger";
import axios from "axios";

function formatPRComment(input: string): string {
  return input
    .replace(/\n\n/g, "\n\n") // Preserve double line breaks
    .replace(/\*\*([^*]+)\*\*/g, "**$1**") // Keep bold formatting
    .replace(/\* (.*?)\n/g, "- $1\n"); // Convert list to markdown format
}

async function commentIntoPR(payload: any, comment: string) {
  const owner = payload.repository.owner.login;
  const repo = payload.repository.name;
  const prNumber = payload.pull_request.number; // Fixed PR number extraction
  const token = process.env.GITHUB_TOKEN!;

  const url = `https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/comments`;

  try {
    const response = await axios.post(
      url,
      { body: comment },
      {
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    Logger.info("PR comment posted successfully:", response.data);
  } catch (error: any) {
    Logger.error("Error commenting on PR:", error.response?.data || error);
  }
}

export async function handle_pr_webhook(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const signature = req.headers["x-hub-signature-256"] as string;
    const payload = req.body;
    const secret = process.env.WEBHOOK_SECRET!;

    if (
      verifyGitHubWebhookSignature({
        payload: JSON.stringify(payload),
        signature,
        secret,
      })
    ) {
      Logger.info("Webhook received");

      const diff_url = payload.pull_request.diff_url;
      const diff_content = await fetch(diff_url);
      const diff = await diff_content.text();
      Logger.info("Fetched diff content successfully");

      const apiKey = process.env.GEMINI_API_KEY!; // Use env variable
      if (!apiKey) {
        throw new Error("Missing Gemini API Key");
      }

      const requestBody = {
        contents: [
          {
            parts: [
              {
                text:
                  "You are an expert code reviewer and software architect. Please provide:\n\n1. PR Summary (2-3 sentences)\n2. Top 5 most important changes and suggestions as bullet points\n\nHere's the code to review:\n\n" +
                  diff,
              },
            ],
          },
        ],
      };

      const geminiResponse = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        requestBody,
        { headers: { "Content-Type": "application/json" } }
      );

      const responseText =
        geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (!responseText) throw new Error("Empty response from Gemini API");

      const formattedPRComment = formatPRComment(responseText);
      Logger.info("Formatted PR comment successfully");

      await commentIntoPR(payload, formattedPRComment);

      res.status(200).send("Webhook processed successfully");
    } else {
      Logger.error("Unauthorized: Invalid signature");
      res.status(401).send("Unauthorized");
    }
  } catch (error: any) {
    Logger.error("Error processing webhook:", error.message || error);
    res.status(500).send("Internal Server Error");
  }
}
