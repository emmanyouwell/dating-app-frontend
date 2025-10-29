import { UserDetails } from "@/common/interfaces/user.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  userDetails: UserDetails | {}; // eslint-disable-line
  isLoggedIn: boolean;
}

const initialState: UserState = {
  userDetails: {},
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.userDetails = action.payload;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.userDetails = {};
      state.isLoggedIn = false;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
