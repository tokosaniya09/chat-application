
import { Chat } from '../../types';
import ChatListItem from './ChatListItem';
import React from 'react';

interface ChatListProps {
    chats: Chat[];
    loading: boolean;
}

export default function ChatList({ chats, loading }: ChatListProps) {
    if (loading) {
        return <div className="p-4 text-center">Loading chats...</div>;
    }

    if (chats.length === 0) {
        return <div className="p-4 text-center text-slate-500">No chats yet. Share your invite link to start a conversation!</div>;
    }

    return (
        <nav className="p-2 space-y-1">
            {chats.map(chat => (
                <ChatListItem key={chat._id} chat={chat} />
            ))}
        </nav>
    );
}