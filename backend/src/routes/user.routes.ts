
import express from 'express';
import { generateInviteLink, getInviterInfo, acceptInvite } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/connect', protect, generateInviteLink);
router.get('/connect/:inviteId', getInviterInfo);
router.post('/connect/:inviteId/accept', protect, acceptInvite);


export default router;
