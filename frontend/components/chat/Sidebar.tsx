'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
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
    const pathname = usePathname();

    const fetchChats = useCallback(async () => {
        try {
            // FIX: Add generic type to api.get to correctly type the response data.
            const res = await api.get<Chat[]>('/chats');
            setChats(res.data);
        } catch (error) {
            console.error('Failed to fetch chats', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchChats();
    }, [fetchChats]);
    
    // This effect handles the case where a user accepts an invite.
    // The redirect can happen before the socket event is processed client-side.
    // This ensures the chat list is updated for the user who accepted the invite.
    useEffect(() => {
        const newConnectionJSON = sessionStorage.getItem('newConnection');
        if (newConnectionJSON) {
            sessionStorage.removeItem('newConnection');
            fetchChats();
        }
    }, [pathname, fetchChats]);


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
                    // Fallback if message is for a chat not yet in state, refetch all chats
                    fetchChats();
                    return prevChats;
                });
            };

            const handleNewChat = (newChat: Chat) => {
                setChats(prevChats => {
                    // Prevent adding a duplicate chat if it's already in the list
                    if (prevChats.some(chat => chat._id === newChat._id)) {
                        return prevChats;
                    }
                    return [newChat, ...prevChats];
                });
            };

            socket.on('receive_message', handleNewMessage);
            socket.on('new_chat', handleNewChat);

            return () => {
                socket.off('receive_message', handleNewMessage);
                socket.off('new_chat', handleNewChat);
            }
        }
    }, [socket, fetchChats]);

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