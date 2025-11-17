import { useAuth as useAuthContext } from '@/context/AuthContext';

/**
 * Custom hook for authentication state management
 * Provides user data, authentication status, loading state, and error handling
 * 
 * This hook wraps the Context-based useAuth for backward compatibility
 * 
 * @returns Object containing authentication state and user data
 * @returns {Object} user - Current user data or null
 * @returns {boolean} isAuthenticated - Whether user is logged in
 * @returns {boolean} loading - Whether authentication check is in progress
 * @returns {string|null} error - Authentication error message or null
 * @returns {Function} refreshUser - Function to manually refresh user session
 * @returns {Function} logout - Function to logout user
 */
export const useAuth = () => {
  return useAuthContext();
};
