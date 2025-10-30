
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { AuthContext } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
}

export const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (authContext?.isAuthenticated && authContext.user) {
      const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
        query: { userId: authContext.user._id },
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else if (!authContext?.isAuthenticated && socket) {
      socket.close();
      setSocket(null);
    }
  }, [authContext?.isAuthenticated, authContext?.user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
