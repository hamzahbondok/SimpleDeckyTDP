import { createSlice } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

type UiStateType = {
  isDesktop?: boolean;
};

const initialState: UiStateType = {
  isDesktop: false
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // setIsDesktop(state, action: PayloadAction<boolean>) {
    //   state.isDesktop = action.payload;
    // },
  },
});

export const selectIsDesktop = (state: RootState) => {
  return state.ui.isDesktop;
};