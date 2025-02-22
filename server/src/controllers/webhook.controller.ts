import { Request, Response } from "express";
import { verifyGitHubWebhookSignature } from "../utils/github_services";
import Logger from "../lib/logger";
import axios from "axios";

function formatPRComment(input: any) {
  return input
    .replace(/\n\n/g, "\n\n") // Preserve double line breaks
    .replace(/\*\*([^*]+)\*\*/g, "**$1**") // Keep bold formatting
    .replace(/\* (.*?)\n/g, "- $1\n"); // Convert list to markdown format
}

const token = process.env.GITHUB_TOKEN;
console.log("token", token);

function commentIntoPR(payload: any, comment: string) {
  let data = JSON.stringify({
    body: comment,
  });

  const owner = payload.repositories.owner.login;
  const repo = payload.repository.name;
  const prNumber = payload.number;

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/comments`,
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json",
    },
    data: data,
  };

  console.log("config", config);

  axios
    .request(config)
    .then((response: any) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error: any) => {
      console.log("error in commenting in PR", error);
    });
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
      console.log("payload", payload);

      const diff_url = payload.pull_request.diff_url;
      // fetch the diff content
      const diff_content = await fetch(diff_url);
      const diff = await diff_content.text();
      console.log("diff", diff);

      let data = JSON.stringify({
        contents: [
          {
            parts: [
              {
                text:
                  "You are an expert code reviewer and software architect. Please provide:\n\n1. PR Summary (2-3 sentences)\n2. Top important changes minimum 1 and maximum 5 in a crisp points\n\n Also try to give more attarctive so that developer gets attaracted \n\n Also give the mini funny poem related to code and the new changes\n\n Here's the code to review:\n\n" +
                  diff,
              },
            ],
          },
        ],
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDv2iVqTTq0kJA8iux_nJxFfgzfgPkgn4k",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      const responseData = await axios.request(config);
      const response = responseData.data.candidates[0].content.parts[0].text;
      console.log("response", response);
      const formattedPRComment = formatPRComment(response);
      console.log("formattedPRComment =>", formattedPRComment);
      commentIntoPR(payload, formattedPRComment);
      res.status(200).send("Webhook received");
    } else {
      Logger.error("Unauthorized");
      res.status(401).send("Unauthorized");
    }
  } catch (error) {
    Logger.error("Unauthorized");

    res.status(401).send("Unauthorized");
  }
}
