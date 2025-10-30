
"use client"
import React from 'react';
import Sidebar from '../../components/chat/Sidebar';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen overflow-hidden bg-lavender-50 dark:bg-dark-bg">
            <Sidebar />
            <main className="flex-1 flex flex-col overflow-hidden">
                {children}
            </main>
        </div>
    );
}
