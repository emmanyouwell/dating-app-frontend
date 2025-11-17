import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { handleAxiosError } from '@/lib/handleAxiosError';

/**
 * Redux state for authentication API operations only
 * Session state (user, isAuthenticated, loading) is managed by AuthContext
 */
interface AuthState {
  loginLoading: boolean;
  loginError: string | null;
  registerLoading: boolean;
  registerError: string | null;
  logoutLoading: boolean;
  logoutError: string | null;
}

const initialState: AuthState = {
  loginLoading: false,
  loginError: null,
  registerLoading: false,
  registerError: null,
  logoutLoading: false,
  logoutError: null,
};

/**
 * Async thunk for login API call
 * Note: Session state is managed by AuthContext, not Redux
 */
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, thunkAPI) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (err) {
      return handleAxiosError(err, 'Login failed', thunkAPI);
    }
  }
);

/**
 * Async thunk for register API call
 * Note: Session state is managed by AuthContext, not Redux
 */
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: { email: string; password: string; name: string }, thunkAPI) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (err) {
      return handleAxiosError(err, 'Registration failed', thunkAPI);
    }
  }
);

/**
 * Async thunk for logout API call
 * Note: Session state is managed by AuthContext, not Redux
 */
export const logoutUser = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await api.post('/auth/logout');
  } catch (err) {
    return handleAxiosError(err, 'Logout failed', thunkAPI);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearLoginError: (state) => {
      state.loginError = null;
    },
    clearRegisterError: (state) => {
      state.registerError = null;
    },
    clearLogoutError: (state) => {
      state.logoutError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loginLoading = true;
        state.loginError = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loginLoading = false;
        state.loginError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginLoading = false;
        state.loginError = action.payload as string;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.registerLoading = true;
        state.registerError = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.registerLoading = false;
        state.registerError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerLoading = false;
        state.registerError = action.payload as string;
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.logoutLoading = true;
        state.logoutError = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.logoutLoading = false;
        state.logoutError = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.logoutLoading = false;
        state.logoutError = action.payload as string;
      });
  },
});

export const { clearLoginError, clearRegisterError, clearLogoutError } = authSlice.actions;
export default authSlice.reducer;
