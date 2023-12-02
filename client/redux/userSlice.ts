import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { UserModel } from "../models/userModel";

// Initial state
const initialState: { user: UserModel | undefined } = {
  user: undefined,
};

// Actual Slice
export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    updateToken: (state, action) => {
      state.user = { ...state.user, token: action.payload.token };
    },
    deleteToken: (state) => {
      state.user = { ...state.user, token: "" };
    },
  },
});

export const { updateToken, deleteToken } = userSlice.actions;

export const selectUser = (state: AppState) => state.userSlice.user;

export default userSlice.reducer;
