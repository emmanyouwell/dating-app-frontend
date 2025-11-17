'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { UserDetails } from '@/common/interfaces/user.interface';

/**
 * Authentication state interface
 */
interface AuthState {
  user: UserDetails | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

/**
 * Create AuthContext with undefined default value
 */
const AuthContext = createContext<AuthState | undefined>(undefined);

/**
 * AuthProvider component that manages session state
 * Handles cookie verification and user session persistence
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Refresh user session by verifying cookie with backend
   */
  const refreshUser = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/users/me');
      
      if (response.data.success && response.data.data) {
        setUser(response.data.data);
      } else {
        setUser(null);
      }
    } catch (err: any) {
      // Handle 401 (unauthorized) gracefully - user is not authenticated
      if (err.response?.status === 401) {
        setUser(null);
        setError(null); // Don't show error for normal unauthenticated state
      } else {
        setUser(null);
        setError(err.response?.data?.message || 'Failed to verify session');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout user by clearing cookie and resetting state
   */
  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // Even if logout fails, clear local state
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setError(null);
      setLoading(false);
    }
  }, []);

  /**
   * Verify session on mount
   */
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const value: AuthState = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    refreshUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access authentication context
 * @throws Error if used outside AuthProvider
 */
export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
