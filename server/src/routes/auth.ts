import express from 'express';
import { login, callback } from '../controllers/authController';

const router = express.Router();

router.get('/login', login);
router.get('/callback', callback);

export default router;
