import express from "express";
import { register_webhook } from "../controllers";

const githubRouter = express.Router();

githubRouter.post("/register/webhook", register_webhook);

export default githubRouter;
