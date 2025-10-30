import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserDetails, UserUpdateProfile } from '@/common/interfaces/user.interface';
import axios, { AxiosError } from 'axios';
import api from '@/lib/api';

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
  updateLoading: boolean;
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
  updateLoading: false,
  error: null,
};

interface ErrorResponse {
  message: string;
}
// -------------------------
// ✅ Async Thunks
// -------------------------
export const updateUserPreferences = createAsyncThunk(
  'user/updateUserPreferences',
  async (preferences: UserPreferences, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/preferences/me`,
        preferences,
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      return rejectWithValue(
        error.response?.data?.message || 'Auth check failed'
      );
    }
  }
);

// ✅ Async thunk to fetch user preferences
export const fetchUserPreferences = createAsyncThunk(
  'user/fetchUserPreferences',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/preferences/me');
      return response.data;
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      return rejectWithValue(
        error.response?.data?.message || 'Auth check failed'
      );
    }
  }
);

// ---------- Async thunk ----------
export const updateProfile = createAsyncThunk<UserUpdateProfile, FormData>(
  'profile/updateProfile',
  async (data: FormData, { rejectWithValue }) => {
    try {
      const response = await api.patch('/users/me', data, {
        headers: {'Content-Type': 'multipart/form-data'}
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
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.preferences = action.payload.data;
      })
      .addCase(updateUserPreferences.rejected, (state) => {
        state.loading = false;
        state.preferences= null;
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
        state.updateLoading = true,
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateLoading = false,
        state.userUpdateDetails=action.payload
        state.error=null
      })
      .addCase(updateProfile.rejected, (state) => {
        state.updateLoading=false
        state.userDetails=null
      })
  },
});

// -------------------------
// ✅ Exports
// -------------------------
export const { setUserDetails, logout } = userSlice.actions;
export default userSlice.reducer;
