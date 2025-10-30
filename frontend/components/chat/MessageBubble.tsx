
import { Message } from '../../types';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface MessageBubbleProps {
    message: Message;
    isOwnMessage: boolean;
}

export default function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn("flex items-end gap-2", isOwnMessage ? "justify-end" : "justify-start")}
        >
            <div className={cn(
                "max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl",
                isOwnMessage 
                    ? "bg-gradient-to-br from-lavender-500 to-lavender-600 text-white rounded-br-none" 
                    : "bg-white dark:bg-dark-primary rounded-bl-none"
            )}>
                <p>{message.content}</p>
                <p className={cn(
                    "text-xs mt-1",
                    isOwnMessage ? "text-lavender-200" : "text-slate-400"
                )}>
                    {format(new Date(message.createdAt), 'p')}
                </p>
            </div>
        </motion.div>
    );
}
