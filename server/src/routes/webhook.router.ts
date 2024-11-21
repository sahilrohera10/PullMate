import express from "express";
import { handle_pr_webhook } from "../controllers";

const webhookRouter = express.Router();

webhookRouter.post("/pr_event", handle_pr_webhook);

export default webhookRouter;
