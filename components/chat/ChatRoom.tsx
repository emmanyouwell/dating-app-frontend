'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useState } from 'react';
import { useSocket } from '@/context/SocketContext';
import { addMessage, fetchMessagesByRoom } from '@/store/slices/chatSlice';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Typography } from '../ui/typography';

export default function ChatRoom({ userId }: { userId: string }) {
  const dispatch = useAppDispatch();
  const { socket } = useSocket();
  const rooms = useAppSelector((state) => state.chat.rooms);
  const loading = useAppSelector((state) => state.chat.loading);

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [text, setText] = useState('');

  const userIds = Object.keys(rooms);
  console.log(rooms);
  const selectedRoom = selectedUser
    ? Object.values(rooms).find((r) => r.userId === selectedUser)
    : null;
  const messages = selectedRoom?.messages || [];

  // ✅ Select chat
  const handleSelectUser = async (uid: string) => {
    setSelectedUser(uid);
    const existingRoom = Object.values(rooms).find((r) => r.userId === uid);
    if (!existingRoom) {
      toast.error('Room does not exist');
      return;
    }
    await dispatch(fetchMessagesByRoom(existingRoom.roomName));
  };

  // ✅ Send message
  const handleSend = () => {
    if (!text.trim() || !selectedUser || !socket) return;
    const roomName =
      selectedRoom?.roomName || [userId, selectedUser].sort().join('-');
    socket.emit('message', {
      toUserId: selectedUser,
      message: text,
      room: roomName,
    });

    dispatch(
      addMessage({
        from: userId,
        to: selectedUser,
        message: text,
        createdAt: new Date().toISOString(),
        room: roomName,
      })
    );
    setText('');
  };

  return (
    <div className='flex h-[calc(100vh-8rem)] rounded-xl border border-border overflow-hidden bg-background text-foreground transition-colors'>
      {/* Sidebar */}
      <div className='w-72 border-r border-border flex flex-col bg-muted/40'>
        <div className='p-4 text-lg font-semibold border-b border-border'>
          Chats
        </div>
        <ScrollArea className='flex-1'>
          {userIds.length === 0 && (
            <div className='text-muted-foreground text-center mt-6'>
              No chats yet
            </div>
          )}
          {Object.values(rooms).map((room) => (
            <button
              key={room.userId}
              onClick={() => handleSelectUser(room.userId)}
              className={`w-full text-left flex items-center gap-4 px-4 py-3 border-b border-border transition-colors ${
                room.userId === selectedUser
                  ? 'bg-accent text-accent-foreground font-semibold'
                  : 'hover:bg-muted'
              }`}
            >
              <Avatar>
                <AvatarImage src={room.toName?.avatar?.url} />
                <AvatarFallback>C</AvatarFallback>
              </Avatar>
              {' '}<Typography variant="p">{String(room.toName?.name)}</Typography>
            </button>
          ))}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className='flex-1 flex flex-col bg-background'>
        <ScrollArea className='h-[calc(100%-4rem)] p-4 space-y-3'>
          {loading && (
            <div className='text-muted-foreground text-center mt-4'>
              Loading messages...
            </div>
          )}
          {!loading && messages.length === 0 && selectedUser && (
            <div className='text-muted-foreground text-center mt-4'>
              No messages yet
            </div>
          )}
          {messages.map((msg, idx) => {
            const isOwn = msg.from === userId;
            return (
              <div
                key={idx}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'} py-1`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-xs wrap-break-word shadow-sm ${
                    isOwn
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-muted text-foreground rounded-bl-none'
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })}
        </ScrollArea>

        {/* Input */}
        {selectedUser && (
          <div className='flex items-center gap-2 border-t border-border p-3 bg-muted/20'>
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder='Type a message...'
              className='flex-1 bg-background'
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button onClick={handleSend} className='px-5'>
              Send
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
