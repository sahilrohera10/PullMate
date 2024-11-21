import { Request, Response } from 'express';
import axios from 'axios';

export const callback = async (req: Request, res: Response):Promise<any> => {
    const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
    const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
    const { code } = req.body;
    
    if (!code) {
        return res.status(400).json({ error: 'Authorization code not provided' });
    }

    try {
        const tokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id:CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code,
            },
            { headers: { Accept: 'application/json' } }
        );
         
        const accessToken = tokenResponse.data.access_token;
        return res.status(200).json({ accessToken });
    } catch (error) {
        console.error('Error during GitHub OAuth callback:', error);
         return res.status(500).json({ error: 'Failed to exchange code for token' });
    }
};