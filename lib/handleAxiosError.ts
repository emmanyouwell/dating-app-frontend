// src/lib/handleAxiosError.ts
import { AsyncThunkConfig, GetThunkAPI } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { toast } from 'sonner'; // or 'react-hot-toast' if you use that

/**
 * Handles and displays Axios or generic errors in a type-safe way.
 * @param error - The error object caught in a try/catch block
 * @param fallbackMessage - Default message shown when no API message is provided
 */
export function handleAxiosError(
  error: unknown,
  fallbackMessage = 'Something went wrong',
  thunk?: GetThunkAPI<AsyncThunkConfig>
) {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message ?? fallbackMessage;
    console.error('[AxiosError]', message, error);
     return thunk?.rejectWithValue(message);
  } else if (error instanceof Error) {
    console.error('[Error]', error.message);
    return thunk?.rejectWithValue(error.message);
  } else {
    console.error('[Unknown Error]', error);
    return thunk?.rejectWithValue(error);
  }
}
