
import { Response } from 'express';
import Chat from '../models/Chat.js';
import { RequestWithUser } from '../middleware/auth.middleware.js';

export const getUserChats = async (req: RequestWithUser, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const chats = await Chat.find({ members: req.user._id })
      .populate('members', '-password')
      .populate({
          path: 'lastMessage',
          populate: { path: 'sender', select: 'username' }
      })
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
