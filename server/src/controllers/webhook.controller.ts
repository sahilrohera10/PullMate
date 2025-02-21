import { Request, Response } from "express";
import { verifyGitHubWebhookSignature } from "../utils/github_services";
import Logger from "../lib/logger";
import { payloadProcessingQueue } from "../clients/queue";
import { Worker } from "bullmq";
const redisConnection = require("../clients/redis-connection");

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
      // Add a job of type 'email' to the 'mailer' queue
      await payloadProcessingQueue.add("payload", payload);
      console.log("payload added into the queue");
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

export async function processPayload() {
  console.log("payload processing started");
  // Add your payload processing logic here
  const worker = new Worker(
    "payload-processing",
    async (payload) => {
      console.log("listening payload from queue =>", payload);
    },
    { connection: redisConnection }
  );

  console.log("payload processing completed");
}
