import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  UserDetails,
  UserUpdateProfile,
} from '@/common/interfaces/user.interface';
import api from '@/lib/api';
import { handleAxiosError } from '@/lib/handleAxiosError';

// -------------------------
// ✅ Interfaces
// -------------------------
export interface UserPreferences {
  minAge: number;
  maxAge: number;
  maxDistance: number;
  genderPreference: ('male' | 'female' | 'other')[];
}

export interface UserState {
  userUpdateDetails: UserUpdateProfile | null;
  userDetails: UserDetails | null;
  preferences: UserPreferences | null;
  isLoggedIn: boolean;
  loading: boolean;
  updatePreferenceLoading: boolean;
  updateLoading: boolean;
  codeLoading: boolean;
  message: string;
  error: string | null;
}

// -------------------------
// ✅ Initial State
// -------------------------
const initialState: UserState = {
  userUpdateDetails: null,
  userDetails: null,
  preferences: null,
  isLoggedIn: false,
  loading: false,
  updatePreferenceLoading: false,
  updateLoading: false,
  codeLoading: false,
  message: '',
  error: null,
};


// -------------------------
// ✅ Async Thunks
// -------------------------
export const updateUserPreferences = createAsyncThunk(
  'user/updateUserPreferences',
  async (preferences: UserPreferences) => {
    try {
      const response = await api.patch(`/preferences/me`, preferences, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      handleAxiosError(err, 'Preferences update failed')
    }
  }
);

// ✅ Async thunk to fetch user preferences
export const fetchUserPreferences = createAsyncThunk(
  'user/fetchUserPreferences',
  async () => {
    try {
      const response = await api.get('/preferences/me');
      return response.data;
    } catch (err) {
      handleAxiosError(err, 'Preferences not fetched');
    }
  }
);

// ---------- Async thunk ----------
export const updateProfile = createAsyncThunk<UserUpdateProfile, FormData>(
  'profile/updateProfile',
  async (data: FormData, { rejectWithValue }) => {
    try {
      const response = await api.patch('/users/me', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (err: unknown) {
      // Narrow unknown error
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('Failed to update profile');
    }
  }
);

// ---------- Async thunk ----------
export const sendVerificationCode = createAsyncThunk(
  'profile/sendVerificationCode',
  async (data: { email: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/resend-code', data);
      return response.data;
    } catch (err: unknown) {
      // Narrow unknown error
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('Failed to update profile');
    }
  }
);
export const verifyEmail = createAsyncThunk(
  'profile/verifyEmail',
  async (data: { email: string; code: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/verify-email', data);
      return response.data;
    } catch (err: unknown) {
      // Narrow unknown error
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('Failed to update profile');
    }
  }
);
// -------------------------
// ✅ Slice
// -------------------------
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserDetails: (state, action: PayloadAction<UserDetails>) => {
      state.userDetails = action.payload;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.userDetails = null;
      state.preferences = null;
      state.isLoggedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserPreferences.pending, (state) => {
        state.updatePreferenceLoading = true;
        state.error = null;
      })
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        state.updatePreferenceLoading = false;
        state.preferences = action.payload.data;
      })
      .addCase(updateUserPreferences.rejected, (state) => {
        state.updatePreferenceLoading = false;
        state.preferences = null;
      })
      .addCase(fetchUserPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.preferences = action.payload.data;
      })
      .addCase(fetchUserPreferences.rejected, (state) => {
        state.loading = false;
        state.preferences = null;
      })
      .addCase(updateProfile.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.userUpdateDetails = action.payload;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state) => {
        state.updateLoading = false;
        state.userDetails = null;
      })
      .addCase(sendVerificationCode.pending, (state) => {
        state.codeLoading = true;
      })
      .addCase(sendVerificationCode.fulfilled, (state, action) => {
        state.codeLoading = false;
        state.message = action.payload.message;
      })
      .addCase(sendVerificationCode.rejected, (state, action) => {
        state.codeLoading = false;
        state.message = action.payload as string;
      })
      .addCase(verifyEmail.pending, (state) => {
        state.codeLoading = true;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.codeLoading = false;
        state.message = action.payload.message;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.codeLoading = false;
        state.message = action.payload as string;
      });
  },
});

// -------------------------
// ✅ Exports
// -------------------------
export const { setUserDetails, logout } = userSlice.actions;
export default userSlice.reducer;
