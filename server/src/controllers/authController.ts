import { Request, Response } from 'express';
import axios from 'axios';

const CLIENT_ID = process.env.GITHUB_CLIENT_ID || "";
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || "";
const REDIRECT_URI = process.env.GITHUB_REDIRECT_URI || "";

export const login = (req: Request, res: Response) => {
    const githubAuthURL = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=repo`;
    res.redirect(githubAuthURL);
};

export const callback = async (req: Request, res: Response):Promise<any> => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ error: 'Authorization code not provided' });
    }

    try {
        const tokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code,
            },
            { headers: { Accept: 'application/json' } }
        );

        const accessToken = tokenResponse.data.access_token;
        res.json({ accessToken });
    } catch (error) {
        console.error('Error during GitHub OAuth callback:', error);
        res.status(500).json({ error: 'Failed to exchange code for token' });
    }
};
