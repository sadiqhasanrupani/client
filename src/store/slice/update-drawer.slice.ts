import { createSlice } from "@reduxjs/toolkit";

export type updateDrawerState = {
  userId: number;
  open: boolean;
};

const initialState: updateDrawerState = {
  userId: -1,
  open: false,
};

const updateDrawerSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    storeUserId(state, action) {
      state.userId = action.payload.userId;
      state.open = action.payload.open;
    },
    toggleDrawer(state, action) {
      state.open = action.payload;
    },
  },
});

const updateDrawerReducer = updateDrawerSlice.reducer;

export const updateDrawerAction = updateDrawerSlice.actions;

export default updateDrawerReducer;
