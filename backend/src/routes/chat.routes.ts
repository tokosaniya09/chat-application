
import express from 'express';
import { getUserChats } from '../controllers/chat.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protect, getUserChats);

export default router;
