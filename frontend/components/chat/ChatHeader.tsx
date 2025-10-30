
interface User {
    _id: string;
    username: string;
    online?: boolean;
    lastSeen?: string;
}

interface ChatHeaderProps {
    user: User | undefined;
    isTyping: boolean;
}

export default function ChatHeader({ user, isTyping }: ChatHeaderProps) {
    if (!user) return null;

    return (
        <header className="p-4 flex items-center bg-white dark:bg-dark-primary border-b border-lavender-200 dark:border-slate-700">
             <div className="w-10 h-10 rounded-full bg-lavender-500 text-white flex items-center justify-center font-bold text-lg mr-3">
                {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
                <h2 className="font-semibold">{user.username}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isTyping ? "typing..." : user.online ? "Online" : "Offline"}
                </p>
            </div>
        </header>
    );
}
