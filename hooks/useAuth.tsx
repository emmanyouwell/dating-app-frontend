import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { checkAuth } from '@/store/slices/authSlice';

/**
 * Custom hook for authentication state management
 * Provides user data, authentication status, loading state, and error handling
 * 
 * @returns Object containing authentication state and user data
 * @returns {Object} user - Current user data or null
 * @returns {boolean} isAuthenticated - Whether user is logged in
 * @returns {boolean} loading - Whether authentication check is in progress
 * @returns {string|null} error - Authentication error message or null
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Check authentication status on component mount
    // This ensures the user is properly authenticated when the app loads
    dispatch(checkAuth());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
  };
};
