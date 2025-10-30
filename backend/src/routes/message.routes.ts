
import express from 'express';
import { sendMessage, getMessagesForChat } from '../controllers/message.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/:chatId', protect, getMessagesForChat);

export default router;
