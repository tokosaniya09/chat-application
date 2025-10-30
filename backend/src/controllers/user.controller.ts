
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User.js';
import Chat from '../models/Chat.js';
import { RequestWithUser } from '../middleware/auth.middleware.js';

export const generateInviteLink = async (req: RequestWithUser, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.inviteId) {
      user.inviteId = uuidv4();
      await user.save();
    }
    
    res.json({ inviteId: user.inviteId });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getInviterInfo = async (req: RequestWithUser, res: Response) => {
    try {
        const { inviteId } = req.params;
        const inviter = await User.findOne({ inviteId }).select('username email');
        if(!inviter) return res.status(404).json({ message: 'Invalid invite link' });

        res.json(inviter);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const acceptInvite = async (req: RequestWithUser, res: Response) => {
    try {
        const { inviteId } = req.params;
        const accepter = req.user;
        const inviter = await User.findOne({ inviteId });

        if(!inviter) return res.status(404).json({ message: 'Invalid invite link' });
        if (!accepter) return res.status(401).json({ message: 'Unauthorized' });
        if ((inviter._id as any).equals((accepter._id as any))) return res.status(400).json({ message: 'You cannot connect with yourself' });
        
        const existingChat = await Chat.findOne({
            members: { $all: [inviter._id, accepter._id] }
        });

        if(existingChat) {
            return res.status(400).json({ message: 'Chat already exists with this user', chatId: existingChat._id });
        }

        const newChat = await Chat.create({
            members: [inviter._id, accepter._id]
        });

        res.status(201).json({ message: 'Chat created successfully', chat: newChat });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
