import { createSlice } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";


const initialState: UiStateType = {
  isDesktop: false,
};

export const selectIsDesktop = (state: RootState) => {
  return state.ui.isDesktop;
};
