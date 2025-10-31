import { useAppSelector } from "@/store/hooks";


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
  const { user, isAuthenticated, loading, error } = useAppSelector(
    (state) => state.auth
  );

  return {
    user,
    isAuthenticated,
    loading,
    error,
  };
};
