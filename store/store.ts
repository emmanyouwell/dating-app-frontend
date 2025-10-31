import { configureStore } from "@reduxjs/toolkit";
// Import your reducers here
import userReducer from "@/store/slices/userSlice";
import authReducer from "@/store/slices/authSlice";
import profileReducer from '@/store/slices/profileSlice';
import matchReducer from '@/store/slices/matchSlice';
import swipeReducer from '@/store/slices/swipeSlice';
import chatReducer from '@/store/slices/chatSlice'
export const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    profile: profileReducer,
    match: matchReducer,
    swipe: swipeReducer,
    chat: chatReducer
    // add more slices here
  },
});

// Infer the types for dispatch and state
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
