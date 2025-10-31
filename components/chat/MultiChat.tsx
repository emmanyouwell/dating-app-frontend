// components/MultiChat.tsx
'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSocket } from '@/context/SocketContext';
import {
  ChatRoom,
  ChatUnlockedPayload,
  Message,
} from '@/common/interfaces/chat.interface';

interface MultiChatProps {
  unlockedUsers: { id: string; name: string }[]; // users unlocked chat
  currentUserId: string;
}

export const MultiChat = ({ unlockedUsers, currentUserId }: MultiChatProps) => {
  const { socket } = useSocket();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>(
    unlockedUsers.map((u) => ({ matchId: u.id, messages: [] }))
  );
  const [activeTab, setActiveTab] = useState(unlockedUsers[0]?.id || '');
  const [inputMap, setInputMap] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (msg: Message) => {
      setChatRooms((prev) =>
        prev.map((room) =>
          room.matchId === msg.fromUserId || room.matchId === msg.toUserId
            ? { ...room, messages: [...room.messages, msg] }
            : room
        )
      );
    };

    const handleChatUnlocked = (data: ChatUnlockedPayload) => {
      const { users } = data;
      const otherUserId = users.find((id) => id !== currentUserId);

      if (!otherUserId) return; // safety check

      if (!chatRooms.find((r) => r.matchId === otherUserId)) {
        setChatRooms((prev) => [
          ...prev,
          { matchId: otherUserId, messages: [] },
        ]);
      }
    };

    socket.on('message', handleMessage);
    socket.on('chat-unlocked', handleChatUnlocked);

    return () => {
      socket.off('message', handleMessage);
      socket.off('chat-unlocked', handleChatUnlocked);
    };
  }, [socket, chatRooms, currentUserId]);

  const sendMessage = (matchId: string) => {
    if (!socket) return;
    const message = inputMap[matchId]?.trim();
    if (!message) return;

    socket.emit('message', { toUserId: matchId, message });
    setInputMap((prev) => ({ ...prev, [matchId]: '' }));
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className='flex flex-col h-full'
    >
      <TabsList className='flex border-b border-gray-200'>
        {unlockedUsers.map((user) => (
          <TabsTrigger key={user.id} value={user.id} className='px-4 py-2'>
            {user.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {chatRooms.map((room) => (
        <TabsContent
          key={room.matchId}
          value={room.matchId}
          className='flex flex-col h-full'
        >
          <div className='flex-1 overflow-y-auto p-4 space-y-2'>
            {room.messages.map((msg, idx) => (
              <div
                key={idx}
                className={
                  msg.fromUserId === currentUserId ? 'text-right' : 'text-left'
                }
              >
                <span className='inline-block bg-gray-100 px-3 py-1 rounded'>
                  {msg.message}
                </span>
              </div>
            ))}
          </div>
          <div className='flex p-2 gap-2 border-t border-gray-200'>
            <Input
              placeholder='Type a message...'
              value={inputMap[room.matchId] || ''}
              onChange={(e) =>
                setInputMap((prev) => ({
                  ...prev,
                  [room.matchId]: e.target.value,
                }))
              }
              className='flex-1'
            />
            <Button onClick={() => sendMessage(room.matchId)}>Send</Button>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};
