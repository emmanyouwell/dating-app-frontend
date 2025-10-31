'use client';

import { ReactNode, useEffect } from 'react';
import { useSocket } from './SocketContext';
import { useAppDispatch } from '@/store/hooks';
import { addMessage, addRoom, ChatMessage } from '@/store/slices/chatSlice';
import {  RoomDto } from '@/common/interfaces/chat.interface';

interface ChatProviderProps {
  children: ReactNode;
  userId: string;
}

export const ChatProvider = ({ children, userId }: ChatProviderProps) => {
  const { socket } = useSocket();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!socket) return;

    
    socket.emit('fetch-rooms');

    
    socket.on('rooms', (rooms: { userId: string; room: RoomDto }[]) => {
      rooms.forEach(({ userId, room }) => {
        dispatch(addRoom({ userId, room }));
      });
    });

    
    socket.on(
      'chat-unlocked',
      ({ users, room }: { users: string[]; room: RoomDto}) => {
        const otherUser = users.find((u) => u !== userId);
        if (otherUser) dispatch(addRoom({ userId: otherUser, room }));
      }
    );

    const handleIncomingMessage = (msg: ChatMessage) => {
        console.log(msg);
      if (!msg?.message) return;
      if (msg.from === userId) return; // ignore echo from self
      dispatch(addMessage(msg));
    };

    socket.on('message', handleIncomingMessage);

    return () => {
      socket.off('rooms');
      socket.off('chat-unlocked');
      socket.off('message');
    };
  }, [socket, userId, dispatch]);

  return <>{children}</>;
};
