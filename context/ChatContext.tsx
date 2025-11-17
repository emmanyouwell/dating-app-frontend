'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { useSocket } from './SocketContext';
import { useAppDispatch } from '@/store/hooks';
import { addMessage, addRoom, clearChat, ChatMessage } from '@/store/slices/chatSlice';
import {  RoomDto } from '@/common/interfaces/chat.interface';

interface ChatProviderProps {
  children: ReactNode;
  userId: string;
}

export const ChatProvider = ({ children, userId }: ChatProviderProps) => {
  const { socket } = useSocket();
  const dispatch = useAppDispatch();
  const previousUserIdRef = useRef<string | null>(null);

  // Clear chat state if userId changes (prevents data leakage between users)
  useEffect(() => {
    if (previousUserIdRef.current !== null && previousUserIdRef.current !== userId) {
      dispatch(clearChat());
    }
    previousUserIdRef.current = userId;
  }, [userId, dispatch]);

  useEffect(() => {
    if (!socket) return;

    // Wait for socket to be connected before emitting fetch-rooms
    const handleConnect = () => {
      if (socket.connected) {
        socket.emit('fetch-rooms');
      }
    };

    // If already connected, emit immediately; otherwise wait for connect event
    if (socket.connected) {
      socket.emit('fetch-rooms');
    } else {
      socket.once('connect', handleConnect);
    }

    // Handle rooms response
    const handleRooms = (rooms: { userId: string; room: RoomDto }[]) => {
      rooms.forEach(({ userId, room }) => {
        dispatch(addRoom({ userId, room }));
      });
    };

    // Handle chat unlocked event
    const handleChatUnlocked = ({
      users,
      room,
    }: {
      users: string[];
      room: RoomDto;
    }) => {
      const otherUser = users.find((u) => u !== userId);
      if (otherUser) dispatch(addRoom({ userId: otherUser, room }));
    };

    // Handle incoming messages
    const handleIncomingMessage = (msg: ChatMessage) => {
      if (!msg?.message) return;
      if (msg.from === userId) return; // ignore echo from self
      dispatch(addMessage(msg));
    };

    socket.on('rooms', handleRooms);
    socket.on('chat-unlocked', handleChatUnlocked);
    socket.on('message', handleIncomingMessage);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('rooms', handleRooms);
      socket.off('chat-unlocked', handleChatUnlocked);
      socket.off('message', handleIncomingMessage);
    };
  }, [socket, userId, dispatch]);

  return <>{children}</>;
};
