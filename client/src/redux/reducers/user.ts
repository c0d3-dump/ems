import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../base/store";
import { UserModel } from "../models/user";

interface initialStateInterface {
  value: UserModel | null;
}

const initialState: initialStateInterface = {
  value: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCollectionName(state, { payload }: { payload: UserModel }) {
      state.value = payload;
    },
  },
});

export const { setCollectionName } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.value;

export default userSlice.reducer;
