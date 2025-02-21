import express from "express";
import { callback } from '../controllers/logincontroller';

const authRouter = express.Router();
authRouter.post('/githubCallback', callback);

export default authRouter;
