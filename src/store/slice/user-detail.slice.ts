import { RoleEnum } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

export type updateDrawerState = {
  role: RoleEnum | "";
};

const initialState: updateDrawerState = {
  role: "",
};

const userDetailSlice = createSlice({
  name: "user-detail",
  initialState,
  reducers: {
    set(state, action) {
      state.role = action.payload.role;
    },
  },
});

const userDetailReducer = userDetailSlice.reducer;

export const userDetailAction = userDetailSlice.actions;

export default userDetailReducer;
