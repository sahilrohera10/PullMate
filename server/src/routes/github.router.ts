import express from "express";
import { register_webhook, repositories , get_workflows} from "../controllers";

const githubRouter = express.Router();

githubRouter.post("/register/webhook", register_webhook);
githubRouter.post("/user/repositories", repositories);
githubRouter.get("/workflows/:user_id", get_workflows);

export default githubRouter;
