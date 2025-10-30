
import { useAuth } from '../../hooks/useAuth';
import { LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const UserAvatar = ({ username }: { username: string }) => (
    <div className="w-10 h-10 rounded-full bg-lavender-500 text-white flex items-center justify-center font-bold text-lg">
        {username.charAt(0).toUpperCase()}
    </div>
);

export default function SidebarHeader() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="p-4 flex justify-between items-center border-b border-lavender-200 dark:border-slate-700">
            <div className="flex items-center space-x-3">
                {user && <UserAvatar username={user.username} />}
                <div>
                    <h2 className="font-semibold">{user?.username}</h2>
                    <div className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">Online</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-lavender-100 dark:hover:bg-slate-700">
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button onClick={logout} className="p-2 rounded-full hover:bg-lavender-100 dark:hover:bg-slate-700">
                    <LogOut size={20} className="text-red-500"/>
                </button>
            </div>
        </header>
    );
}
