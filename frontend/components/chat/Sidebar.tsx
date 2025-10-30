
'use client';

import { useState, useEffect } from 'react';
import ChatList from './ChatList';
import SidebarHeader from './SidebarHeader';
import InviteLinkGenerator from './InviteLinkGenerator';
import api from '../../lib/api';
import { useSocket } from '../../hooks/useSocket';
import { Chat } from '../../types';

export default function Sidebar() {
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(true);
    const { socket } = useSocket();

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await api.get('/chats');
                setChats(res.data);
            } catch (error) {
                console.error('Failed to fetch chats', error);
            } finally {
                setLoading(false);
            }
        };
        fetchChats();
    }, []);

    useEffect(() => {
        if(socket) {
            const handleNewMessage = (newMessage: any) => {
                setChats(prevChats => {
                    const chatIndex = prevChats.findIndex(c => c._id === newMessage.chatId._id);
                    if (chatIndex > -1) {
                        const updatedChat = { ...prevChats[chatIndex], lastMessage: newMessage, updatedAt: newMessage.updatedAt };
                        const otherChats = prevChats.filter(c => c._id !== newMessage.chatId._id);
                        return [updatedChat, ...otherChats];
                    }
                    return prevChats; // Or fetch new chat if it doesn't exist
                });
            };

            socket.on('receive_message', handleNewMessage);
            return () => {
                socket.off('receive_message', handleNewMessage);
            }
        }
    }, [socket]);

    return (
        <aside className="w-full md:w-80 lg:w-96 flex flex-col h-full bg-white dark:bg-dark-primary border-r border-lavender-200 dark:border-slate-700">
            <SidebarHeader />
            <div className="p-4 border-b border-lavender-200 dark:border-slate-700">
                <InviteLinkGenerator />
            </div>
            <div className="flex-1 overflow-y-auto">
                <ChatList chats={chats} loading={loading} />
            </div>
        </aside>
    );
}
