import { Request, Response } from "express";

export async function handle_pr_webhook(
  req: Request,
  res: Response
): Promise<any> {
  console.log("Received a PR webhook event with body =>", req.body);

  return res
    .status(200)
    .json({ message: "PR webhook event received successfully" });
}
