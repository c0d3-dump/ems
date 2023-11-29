import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import userReducer from "../reducers/user";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  devTools: true,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
