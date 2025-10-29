import { configureStore } from "@reduxjs/toolkit";
// Import your reducers here
import userReducer from "@/store/slices/userSlice";
import authReducer from "@/store/slices/authSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    // add more slices here
  },
});

// Infer the types for dispatch and state
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
