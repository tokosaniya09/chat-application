
'use client'

import { Chat } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../../lib/utils';

interface ChatListItemProps {
    chat: Chat;
}

const UserAvatar = ({ username }: { username: string }) => (
    <div className="w-12 h-12 rounded-full bg-lavender-500 text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
        {username.charAt(0).toUpperCase()}
    </div>
);


export default function ChatListItem({ chat }: ChatListItemProps) {
    const { user } = useAuth();
    const { chatId } = useParams();

    const otherUser = chat.members.find(member => member._id !== user?._id);
    const isActive = chatId === chat._id;

    if (!otherUser) return null;

    const lastMessageContent = chat.lastMessage 
        ? `${chat.lastMessage.sender._id === user?._id ? "You: " : ""}${chat.lastMessage.content}`
        : "No messages yet";

    const truncate = (str: string, n: number) => {
        return str?.length > n ? str.substr(0, n - 1) + "..." : str;
    }

    return (
        <Link href={`/${chat._id}`} className={cn(
            "flex items-center p-3 space-x-4 rounded-lg cursor-pointer transition-colors",
            isActive 
                ? "bg-lavender-200 dark:bg-dark-secondary" 
                : "hover:bg-lavender-100 dark:hover:bg-slate-700"
        )}>
            <UserAvatar username={otherUser.username} />
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                    <p className="font-semibold truncate">{otherUser.username}</p>
                    {chat.lastMessage && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {formatDistanceToNow(new Date(chat.lastMessage.createdAt), { addSuffix: true })}
                        </p>
                    )}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 truncate">
                    {truncate(lastMessageContent, 30)}
                </p>
            </div>
        </Link>
    );
}
