// hooks/useErrorHandler.ts

import axios from 'axios';
import { toast } from 'sonner';

/**
 * A reusable hook for consistent frontend error handling
 * Automatically parses error messages and displays them using Sonner.
 */
export const useErrorHandler = () => {
  const handleError = (error: unknown, customMessage?: string) => {
    let message = customMessage || 'Something went wrong. Please try again.';

    // Axios error
    if (axios.isAxiosError(error)) {
      message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        message;
    }
    // Native JS Error
    else if (error instanceof Error) {
      message = error.message || message;
    }
    // Unknown object/string
    else if (typeof error === 'string') {
      message = error;
    }

    toast.error(message);
    console.error('[useErrorHandler]', error);
  };

  return handleError;
};
