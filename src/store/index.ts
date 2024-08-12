import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";

//^ reducers
import updateDrawerReducer from "./slice/update-drawer.slice";

const store = configureStore({
  reducer: {
    updateDrawer: updateDrawerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const AppUseSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
