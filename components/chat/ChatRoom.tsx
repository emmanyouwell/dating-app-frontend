'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useState, useRef, useEffect, useMemo } from 'react';

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
  const selectedRoom = selectedUser
    ? Object.values(rooms).find((r) => r.userId === selectedUser)
    : null;

  const messages = useMemo(
    () => selectedRoom?.messages || [],
    [selectedRoom?.messages]
  );

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

  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scrollArea = scrollAreaRef.current?.querySelector(
      '[data-radix-scroll-area-viewport]'
    );
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  return (
    <div className='flex flex-col md:flex-row h-[calc(100vh-8rem)] rounded-xl border border-border overflow-hidden bg-background text-foreground transition-colors'>
      {/* Sidebar */}
      <div
        className={`${
          selectedUser ? 'hidden md:flex' : 'flex'
        } w-full md:w-72 border-r border-border flex-col bg-muted/40`}
      >
        <div className='p-4 text-lg font-semibold border-b border-border text-foreground'>
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
              className={`w-full text-left flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2 sm:py-3 border-b border-border transition-colors ${
                room.userId === selectedUser
                  ? 'dark:bg-pink-900 bg-primary text-primary-foreground font-semibold'
                  : 'hover:bg-muted'
              }`}
            >
              <Avatar className='h-8 w-8 sm:h-10 sm:w-10'>
                <AvatarImage src={room.toName?.avatar?.url} />
                <AvatarFallback>
                  {room.toName?.name?.[0]?.toUpperCase() || 'C'}
                </AvatarFallback>
              </Avatar>
              <Typography variant='p' className='truncate text-sm sm:text-base'>
                {String(room.toName?.name)}
              </Typography>
            </button>
          ))}
        </ScrollArea>
      </div>
      {/* Chat Area */}
      <div
        className={`flex flex-col bg-background h-full ${
          !selectedUser ? 'hidden md:flex md:flex-1' : 'flex flex-1'
        }`}
      >
        {/* Mobile header */}
        {selectedUser && (
          <div className='flex md:hidden items-center gap-2 border-b border-border p-3 bg-muted/40'>
            <Button
              onClick={() => setSelectedUser(null)}
              variant='ghost'
              size='sm'
              className='text-sm text-muted-foreground hover:text-foreground'
            >
              ← Back
            </Button>
            <Typography variant='p' className='font-semibold truncate text-foreground'>
              {selectedRoom?.toName?.name || 'Chat'}
            </Typography>
          </div>
        )}

        {/* Chat list */}
        <div className='flex-1 min-h-0'>
          <ScrollArea
            ref={scrollAreaRef}
            className='h-full p-3 sm:p-4 space-y-2 sm:space-y-3'
          >
            <div ref={scrollContentRef}>
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
                    className={`flex ${
                      isOwn ? 'justify-end' : 'justify-start'
                    } py-0.5 sm:py-1`}
                  >
                    <div
                      className={`px-3 sm:px-4 py-2 rounded-2xl max-w-[85%] sm:max-w-xs wrap-break-word shadow-sm text-sm sm:text-base ${
                        isOwn
                          ? 'dark:bg-pink-900 bg-primary text-primary-foreground rounded-br-none'
                          : 'bg-muted text-foreground rounded-bl-none'
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        {/* Input area (always visible at bottom) */}
        {selectedUser && (
          <div className='shrink-0 flex items-center gap-2 border-t border-border p-2 sm:p-3 bg-muted/20'>
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder='Type a message...'
              className='flex-1 bg-background text-sm sm:text-base'
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button
              onClick={handleSend}
              className='px-3 sm:px-5 text-sm sm:text-base'
            >
              Send
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
