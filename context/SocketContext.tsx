'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/hooks/useAuth';

interface SocketContextValue {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextValue>({ socket: null });

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (loading || !user) return; // wait until user is ready
    if (socket) return; // socket already exists

    const s = io(process.env.NEXT_PUBLIC_API_URL, {
      query: { userId: user.id },
      transports: ['websocket'], // force websocket
      autoConnect: true,
    });

    setSocket(s);

    s.on('connect', () => {
      console.log('Socket connected:', s.id);
    });

    s.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    return () => {
      s.disconnect();
      setSocket(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
