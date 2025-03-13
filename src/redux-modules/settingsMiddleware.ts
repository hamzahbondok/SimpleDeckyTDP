import { Dispatch } from "redux";
import {
  activeGameIdSelector,
  getAdvancedOptionsInfoSelector,
  setCurrentGameInfo,
  setEnableTdpProfiles,
  setReduxTdp,
  updateAdvancedOption,
  updateInitialLoad,
  updateTdpProfiles,
} from "./settingsSlice";
import {
  setSetting,
  persistTdp,
  saveTdpProfiles,
} from "../backend/utils";
import { PayloadAction } from "@reduxjs/toolkit";
import { cleanupAction, resumeAction } from "./extraActions";
import { debounce } from "lodash";

const resetTdpActionTypes = [
  setEnableTdpProfiles.type,
  updateTdpProfiles.type,
  setCurrentGameInfo.type,
  updateInitialLoad.type,
] as string[];

const debouncedPersistTdp = debounce(persistTdp, 1000);


export const settingsMiddleware =
  (store: any) => (dispatch: Dispatch) => (action: PayloadAction<any>) => {
    const result = dispatch(action);

    const state = store.getState();

    const { advancedState } = getAdvancedOptionsInfoSelector(state);
 

    return result;
  };
