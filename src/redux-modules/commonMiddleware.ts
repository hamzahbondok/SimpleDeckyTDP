import { Dispatch } from "redux";
import {
  activeGameIdSelector,
  getAdvancedOptionsInfoSelector,
  setEnableTdpProfiles,
  updateAdvancedOption,
  updateMaxTdp,
  updateMinTdp,
} from "./settingsSlice";
import {
  setSetting,
  onSuspend,
} from "../backend/utils";
import { PayloadAction } from "@reduxjs/toolkit";
import { extractCurrentGameId } from "../utils/constants";
import { suspendAction } from "./extraActions";

export const commonMiddleware =
  (store: any) => (dispatch: Dispatch) => (action: PayloadAction<any>) => {
    const result = dispatch(action);

    const state = store.getState();

    
    const activeGameId = activeGameIdSelector(state);

    if (action.type === suspendAction.type) {
      onSuspend();
    }

    if (action.type === setEnableTdpProfiles.type) {
      setSetting({
        name: "enableTdpProfiles",
        value: action.payload,
      });
    }
    if (action.type === updateMinTdp.type) {
      setSetting({
        name: "minTdp",
        value: action.payload,
      });
    }
    if (action.type === updateMaxTdp.type) {
      setSetting({
        name: "maxTdp",
        value: action.payload,
      });
    }

    if (action.type === updateAdvancedOption.type) {
      const { advancedState } = getAdvancedOptionsInfoSelector(state);
      setSetting({
        name: "advanced",
        value: advancedState,
      });
    }

    return result;
  };
