'use client';

import { ReactNode, useEffect } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

import { checkAuth } from '@/store/slices/authSlice';
import { store } from '@/store/store';
import { SocketIOProvider } from './SocketIOProvider';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { ChatProvider } from '@/context/ChatContext';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/store/hooks';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <Toaster position='top-right' richColors />
      <ThemeProvider
        attribute='class'
        defaultTheme='light'
        enableSystem
        disableTransitionOnChange
      >
        <AuthGate>{children}</AuthGate>
      </ThemeProvider>
    </ReduxProvider>
  );
}

// Separate component to safely use useAuth after ReduxProvider is mounted
function AuthGate({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  

  if (!user) {
    return <>{children}</>;
  }

  return (
    <SocketIOProvider>
      <ChatProvider userId={user.id}>{children}</ChatProvider>
    </SocketIOProvider>
  );
}
