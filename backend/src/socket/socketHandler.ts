
import { Server, Socket } from 'socket.io';
import User from '../models/User.js';

let io: Server;

const userSocketMap = new Map<string, string>(); // userId -> socketId

export function initializeSocket(serverIo: Server) {
  io = serverIo;
  
  io.on('connection', (socket: Socket) => {
    const userId = socket.handshake.query.userId as string;
    if (userId) {
      userSocketMap.set(userId, socket.id);
      socket.join(userId);

      // Handle online status
      User.findByIdAndUpdate(userId, { online: true }).catch(err => console.error(err));
      io.emit('user_online', userId);

      socket.on('disconnect', () => {
        userSocketMap.delete(userId);
        socket.leave(userId);
        
        // Handle offline status
        User.findByIdAndUpdate(userId, { online: false, lastSeen: new Date() }).catch(err => console.error(err));
        io.emit('user_offline', { userId, lastSeen: new Date() });
      });

      socket.on('join_room', (chatId) => {
        socket.join(chatId);
      });

      socket.on('typing', ({ chatId, receiverId }) => {
        const receiverSocketId = userSocketMap.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('typing', { chatId });
        }
      });
      
      socket.on('stop_typing', ({ chatId, receiverId }) => {
        const receiverSocketId = userSocketMap.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('stop_typing', { chatId });
        }
      });

      socket.on('mark_as_seen', async ({ chatId, userId }) => {
        // This is a complex feature, for now we can just acknowledge it
        // In a full implementation, you'd update message statuses in the DB
        // and emit an event back.
      });
    }
  });
}

export function getSocketIoInstance() {
  if (!io) {
    throw new Error('Socket.IO not initialized!');
  }
  return io;
}
