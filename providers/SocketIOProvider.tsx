'use client';

import { SocketProvider } from '@/context/SocketContext';
import { useAuth } from '@/hooks/useAuth';

export function SocketIOProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  // Wait until user is loaded
  if (loading || !user) return <>{children}</>;

  // Connect socket only once user is ready
  return <SocketProvider >{children}</SocketProvider>;
}
