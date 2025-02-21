import { Request, Response } from "express";
import { verifyGitHubWebhookSignature } from "../utils/github_services";
import Logger from "../lib/logger";
import axios from "axios";

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
                  "You are an expert code reviewer and software architect. Please provide:\n\n1. PR Summary (2-3 sentences)\n2. Top 5 most important changes and suggestions as bullet points\n\nHere's the code to review:\n\n" +
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

      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          const data = JSON.stringify(response.data);
          console.log("AI response => ", data);
        })
        .catch((error) => {
          console.log(error);
        });
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
