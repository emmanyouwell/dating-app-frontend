'use client';

import { ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

import { store } from '@/store/store';
import { SocketIOProvider } from './SocketIOProvider';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { ChatProvider } from '@/context/ChatContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <Toaster position='top-right' richColors />
      <ThemeProvider
        attribute='class'
        defaultTheme='light'
        disableTransitionOnChange
      >
        <AuthProvider>
          <AuthGate>{children}</AuthGate>
        </AuthProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}

/**
 * Separate component to conditionally render SocketIO and Chat providers
 * based on authentication state. AuthContext handles session verification automatically.
 */
function AuthGate({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  // Only provide SocketIO and Chat when user is authenticated
  if (!user) {
    return <>{children}</>;
  }

  return (
    <SocketIOProvider>
      <ChatProvider userId={user.id}>{children}</ChatProvider>
    </SocketIOProvider>
  );
}
