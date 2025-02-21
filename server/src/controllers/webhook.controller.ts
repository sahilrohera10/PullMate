import { Request, Response } from "express";
import { verifyGitHubWebhookSignature } from "../utils/github_services";
import Logger from "../lib/logger";
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
