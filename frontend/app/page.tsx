
import ChatLayout from "./(chat)/layout";
import { MessageCircle } from 'lucide-react';

export default function Home() {
  return (
    <ChatLayout>
        {/* FIX: Inlined chat page content to avoid importing a page component and fix property error. */}
        <div className="flex h-full flex-col items-center justify-center bg-lavender-100 dark:bg-dark-surface text-slate-500 dark:text-slate-400">
          <MessageCircle className="w-24 h-24 mb-4 text-lavender-300 dark:text-dark-primary" />
          <h2 className="text-2xl font-semibold">Welcome to WhisperWave</h2>
          <p>Select a chat to start messaging</p>
        </div>
    </ChatLayout>
  );
}