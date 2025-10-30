
import { Response } from 'express';
import Message from '../models/Message.js';
import Chat from '../models/Chat.js';
import { RequestWithUser } from '../middleware/auth.middleware.js';
import { getSocketIoInstance } from '../socket/socketHandler.js';


export const sendMessage = async (req: RequestWithUser, res: Response) => {
  const { chatId, content } = req.body;
  
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!chatId || !content) {
    return res.status(400).json({ message: 'Invalid data passed into request' });
  }

  try {
    const newMessage = await Message.create({
      sender: req.user._id,
      content,
      chatId,
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'username email')
      .populate('chatId');

    await Chat.findByIdAndUpdate(chatId, { lastMessage: populatedMessage?._id });

    const io = getSocketIoInstance();
    const chat: any = populatedMessage?.chatId;

    if (
      chat &&
      chat.members &&
      req.user &&
      typeof req.user._id === 'string'
    ) {
      const senderId = req.user._id;
      chat.members.forEach((member: any) => {
        if (member._id.toString() !== senderId) {
          io.to(member._id.toString()).emit('receive_message', populatedMessage);
        }
      });
      // Also emit to sender for UI update consistency
      io.to(senderId).emit('receive_message', populatedMessage);
    }


    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMessagesForChat = async (req: RequestWithUser, res: Response) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId })
      .populate('sender', 'username email')
      .sort({ createdAt: 1 });
      
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
