'use client';

import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/hooks/useAuth';

interface SocketContextValue {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextValue>({ socket: null });

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    // If loading or no user, disconnect and clear socket
    if (loading || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        socketUserIdRef.current = null;
      }
      return;
    }

    // If socket exists for a different user, disconnect it first
    if (socket) {
      const socketUserId = socketUserIdRef.current;
      // If socket is disconnected or userId doesn't match, disconnect and recreate
      if (!socket.connected || !socketUserId || socketUserId !== user.id) {
        socket.disconnect();
        setSocket(null);
        socketUserIdRef.current = null;
      } else {
        // Socket is already connected for this user
        return;
      }
    }

    // Create new socket connection for the current user
    const s = io(process.env.NEXT_PUBLIC_API_URL, {
      query: { userId: user.id },
      transports: ['websocket'], // force websocket
      autoConnect: true,
    });

    setSocket(s);
    socketUserIdRef.current = user.id;

    s.on('connect', () => {
      console.log('Socket connected:', s.id, 'for user:', user.id);
    });

    s.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    s.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    return () => {
      s.disconnect();
      setSocket(null);
      socketUserIdRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, loading]);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
