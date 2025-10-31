// src/lib/handleAxiosError.ts
import { AxiosError } from 'axios';
import { toast } from 'sonner'; // or 'react-hot-toast' if you use that

/**
 * Handles and displays Axios or generic errors in a type-safe way.
 * @param error - The error object caught in a try/catch block
 * @param fallbackMessage - Default message shown when no API message is provided
 */
export function handleAxiosError(
  error: unknown,
  fallbackMessage = 'Something went wrong'
): void {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message ?? fallbackMessage;
    console.error('[AxiosError]', message, error);
    toast.error(message);
  } else if (error instanceof Error) {
    console.error('[Error]', error.message);
    toast.error(error.message || fallbackMessage);
  } else {
    console.error('[Unknown Error]', error);
    toast.error(fallbackMessage);
  }
}
