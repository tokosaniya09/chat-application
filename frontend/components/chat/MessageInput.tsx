
// FIX: Import React to use React.FormEvent type and correct hooks import
import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile } from 'lucide-react';
import { useSocket } from '../../hooks/useSocket';

interface MessageInputProps {
    onSendMessage: (content: string) => void;
    chatId: string;
    receiverId: string;
}

export default function MessageInput({ onSendMessage, chatId, receiverId }: MessageInputProps) {
    const [content, setContent] = useState('');
    const { socket } = useSocket();
    // FIX: Use 'number' for the timeout ID in a browser environment instead of 'NodeJS.Timeout'
    const typingTimeoutRef = useRef<number | null>(null);

    const handleTyping = () => {
        if (socket) {
            socket.emit('typing', { chatId, receiverId });

            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            typingTimeoutRef.current = window.setTimeout(() => {
                socket.emit('stop_typing', { chatId, receiverId });
            }, 2000);
        }
    };
    
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSendMessage(content);
        setContent('');
        if (socket && typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            socket.emit('stop_typing', { chatId, receiverId });
        }
    };

    return (
        <div className="p-4 bg-white dark:bg-dark-primary border-t border-lavender-200 dark:border-slate-700">
            <form onSubmit={handleSubmit} className="flex items-center space-x-3">
                <button type="button" className="p-2 text-slate-500 hover:text-lavender-600">
                    <Smile />
                </button>
                <input
                    type="text"
                    value={content}
                    onChange={(e) => {
                        setContent(e.target.value);
                        handleTyping();
                    }}
                    placeholder="Type a message..."
                    className="flex-1 bg-lavender-100 dark:bg-slate-700 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lavender-400"
                />
                <button type="submit" className="p-2 bg-lavender-600 text-white rounded-full hover:bg-lavender-700 transition-colors">
                    <Send />
                </button>
            </form>
        </div>
    );
}