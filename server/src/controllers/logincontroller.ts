import { Request, Response } from "express";
import axios from "axios";
import { v4 } from "uuid";
import { USER } from "../interfaces/namespace";
import { insert_user } from "../services/user.service";
import { codeSchema } from "../validations/login.validations";


export const callback = async (req: Request, res: Response): Promise<any> => {
  const { error } = codeSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: "Validation error",
      error: error.details.map((err) => err.message),
    });
  }
  const { Octokit } = await import("octokit");

  const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
  const baseURL = process.env.GITHUB_BASE_URL;

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Authorization code not provided" });
  }

  try {
    const tokenResponse = await axios.post(
      `${baseURL}/login/oauth/access_token`,
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );

    const accessToken = tokenResponse.data.access_token;

    const octokit = new Octokit({
      auth: accessToken,
    });

    const user_info = await octokit.request("GET /user", {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    const user_body_query = [
      v4(),
      user_info.data.name,
      user_info.data.avatar_url,
      user_info.data.location,
      user_info.data.email,
      user_info.data.bio,
      user_info.data.login,
    ];

    const user_insert_response = await insert_user(user_body_query);

    return res.status(200).json({ accessToken, user_insert_response });
  } catch (error) {
    console.error("Error during GitHub auth:", error);
    return res.status(500).json({ error: error });
  }
};
