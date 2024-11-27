import express from "express";
import { get_workflows} from "../controllers";

const workflowRouter = express.Router();

workflowRouter.get("/:user_id", get_workflows);

export default workflowRouter;
