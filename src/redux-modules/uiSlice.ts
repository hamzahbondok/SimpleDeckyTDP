import { createSlice } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";

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
