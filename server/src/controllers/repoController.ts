import { Request, Response } from 'express';
import axios from 'axios';

export const fetchRepositories = async (req: Request, res: Response):Promise<any> => {
    const accessToken = req.headers.authorization?.split(' ')[1];

    if (!accessToken) {
        return res.status(401).json({ error: 'Unauthorized: Missing access token' });
    }

    try {
        const repoResponse = await axios.get('https://api.github.com/user/repos', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/vnd.github.v3+json',
            },
            
        });

        res.json(repoResponse.data);
    } catch (error) {
        console.error('Error fetching repositories:', error);
        res.status(500).json({ error: 'Failed to fetch repositories' });
    }
};
