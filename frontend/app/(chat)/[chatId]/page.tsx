
'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import { useSocket } from '../../../hooks/useSocket';
import api from '../../../lib/api';
import ChatHeader from '../../../components/chat/ChatHeader';
import MessageBubble from '../../../components/chat/MessageBubble';
import MessageInput from '../../../components/chat/MessageInput';
import { Message, Chat as ChatType } from '../../../types';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function ChatWindow() {
  const { chatId } = useParams();
  const auth = useAuth();
  const user = (auth as any).user;
  const { socket } = useSocket();

  const [chat, setChat] = useState<ChatType | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const otherUser = chat?.members.find(member => member._id !== user?._id);

  useEffect(() => {
    if (chatId) {
      const fetchChatData = async () => {
        try {
          setLoading(true);
          // In a real app, you would fetch chat details first.
          // For simplicity, we are fetching chats in the sidebar and relying on that context.
          // Let's fetch messages directly.
          const res = await api.get(`/messages/${chatId}`);
          setMessages(res.data);
        } catch (error) {
          console.error('Failed to fetch messages', error);
        } finally {
          setLoading(false);
        }
      };
      fetchChatData();
    }
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  useEffect(() => {
    if (socket) {
      const handleNewMessage = (newMessage: Message) => {
        if (newMessage.chatId === chatId) {
          setMessages(prev => [...prev, newMessage]);
        }
      };
      
      const handleTyping = (data: { chatId: string }) => {
        if (data.chatId === chatId) {
          setIsTyping(true);
        }
      };

      const handleStopTyping = (data: { chatId: string }) => {
        if (data.chatId === chatId) {
          setIsTyping(false);
        }
      };

      socket.on('receive_message', handleNewMessage);
      socket.on('typing', handleTyping);
      socket.on('stop_typing', handleStopTyping);

      return () => {
        socket.off('receive_message', handleNewMessage);
        socket.off('typing', handleTyping);
        socket.off('stop_typing', handleStopTyping);
      };
    }
  }, [socket, chatId]);


  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    try {
      // The message is sent via API and then broadcasted via socket, including to sender.
      // So no need to add it to state here.
      await api.post('/messages', { chatId, content });
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };
  
  if (loading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="flex flex-col h-full bg-lavender-100 dark:bg-dark-surface">
      <ChatHeader user={otherUser} isTyping={isTyping} />
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <AnimatePresence>
          <motion.div className="space-y-4">
            {messages.map((msg) => (
              <MessageBubble key={msg._id} message={msg} isOwnMessage={msg.sender._id === user?._id} />
            ))}
            <div ref={messagesEndRef} />
          </motion.div>
        </AnimatePresence>
      </div>
      <MessageInput onSendMessage={handleSendMessage} chatId={chatId as string} receiverId={otherUser?._id as string} />
    </div>
  );
}
