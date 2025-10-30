
"use client";

import { AuthProvider } from './AuthContext';
import { SocketProvider } from './SocketContext';
import { ThemeProvider } from './ThemeContext';
// FIX: Import React to use React.ReactNode and for correct JSX typing
import React from 'react';

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <AuthProvider>
                <SocketProvider>
                    {children}
                </SocketProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}