import express from 'express';
import { fetchRepositories } from '../controllers/repoController';

const router = express.Router();

router.get('/', fetchRepositories);

export default router;
