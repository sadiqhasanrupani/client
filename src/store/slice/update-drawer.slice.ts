import { createSlice } from "@reduxjs/toolkit";

export type updateDrawerState = {
  userId: number;
  open: boolean;
  classId: number;
  editClassOpen: boolean;
};

const initialState: updateDrawerState = {
  userId: -1,
  open: false,
  classId: -1,
  editClassOpen: false,
};

const updateDrawerSlice = createSlice({
  name: "update-drawer",
  initialState,
  reducers: {
    storeUserId(state, action) {
      state.userId = action.payload.userId;
      state.open = action.payload.open;
    },
    toggleDrawer(state, action) {
      state.open = action.payload;
    },
    classroomDrawerHandler(state, action) {
      state.classId = action.payload.classId;
      state.editClassOpen = action.payload.editClassOpen;
    },
  },
});

const updateDrawerReducer = updateDrawerSlice.reducer;

export const updateDrawerAction = updateDrawerSlice.actions;

export default updateDrawerReducer;
