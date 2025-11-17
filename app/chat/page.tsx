// app/chat/page.tsx
'use client';

import ChatRoom from '@/components/chat/ChatRoom';
import Navbar from '@/components/layout/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { Loader } from 'lucide-react';

export default function ChatPage() {
  const { user, loading, isAuthenticated} = useAuth();

  // Show loader while checking authentication
  if (loading) {
    return (
      <div className='flex h-screen items-center justify-center bg-background'>
        <Loader className='animate-spin text-muted-foreground' />
      </div>
    );
  }

  // Redirect or show message if user is not logged in
  if (!user) {
    return (
      <div className='flex h-screen items-center justify-center bg-background'>
        <p className='text-muted-foreground'>You must be logged in to access chat.</p>
      </div>
    );
  }

  return (
    <ProtectedRoute profileCheck>
    <Navbar isAuthenticated={isAuthenticated} loading={loading}/>
    <div className='w-full h-screen p-8 bg-background'>
      <ChatRoom userId={user.id} />
    </div>
    </ProtectedRoute>
  );
}
