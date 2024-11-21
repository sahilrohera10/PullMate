import { Request, Response } from 'express';
import axios from 'axios';
import { tokenStore} from './authController';

export const fetchRepositories = async (req: Request, res: Response): Promise<any> => {
    const userId = 'current-user'; 
    const accessToken = tokenStore[userId];

    if (!accessToken) {
        return res.status(401).json({ error: 'Unauthorized: Missing access token' });
    }

    try {
        const repoResponse = await axios.get('https://api.github.com/repositories', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28',
            },
        });

        res.json(repoResponse.data);
    } catch (error:any) {
        console.error('Error fetching public repositories:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch public repositories' });
    }
};
