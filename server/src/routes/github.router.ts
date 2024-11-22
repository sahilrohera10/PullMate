import express from "express";
import { register_webhook, repositories } from "../controllers";

const githubRouter = express.Router();

githubRouter.post("/register/webhook", register_webhook);
githubRouter.get("/user/repositories", repositories);

export default githubRouter;
