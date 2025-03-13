import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { clone, get, merge, set } from "lodash";
import {
  DEFAULT_START_TDP,
  MIN_TDP_RANGE,
} from "../utils/constants";
import { RootState } from "./store";
import { AdvancedOptionsEnum } from "../backend/utils";

type Partial<T> = {
  [P in keyof T]?: T[P];
};

export type AdvancedOption = {
  name: string;
  type: string;
  defaultValue: any;
  currentValue: any;
  statePath: string;
  description?: string;
  disabled?: { [k: string]: any };
};

export interface TdpRangeState {
  minTdp: number;
  maxTdp: number;
}

export type TdpProfile = {
  tdp: number;
};

export type TdpProfiles = {
  [key: string]: TdpProfile;
};


export interface SettingsState extends TdpRangeState {
  initialLoad: boolean;
  tdpProfiles: TdpProfiles;
  previousGameId: string | undefined;
  currentGameId: string;
  gameDisplayNames: { [key: string]: string };
  enableTdpProfiles: boolean;
  advancedOptions: AdvancedOption[];
  advanced: { [optionName: string]: any };
  pluginVersionNum: string;
  supportsCustomAcPowerManagement?: boolean;
  isAcPower?: boolean;
}

export type InitialStateType = Partial<SettingsState>;

const initialState: SettingsState = {
  previousGameId: undefined,
  currentGameId: "default",
  gameDisplayNames: {
    default: "default",
  },
  advanced: {},
  advancedOptions: [],
  minTdp: MIN_TDP_RANGE,
  maxTdp: 15,
  initialLoad: true,
  enableTdpProfiles: false,
  tdpProfiles: {
    default: {
      tdp: DEFAULT_START_TDP,
    },
  },
  pluginVersionNum: "",
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setAcPower(state, action: PayloadAction<number>) {
      const event = action.payload;
      if (event === 2) {
        state.isAcPower = true;
      }
      if (event === 1) {
        state.isAcPower = false;
      }
    },
    setReduxTdp: (state, action: PayloadAction<number>) => {
      const tdp = action.payload;
      const { currentGameId, enableTdpProfiles } = state;

      if (enableTdpProfiles) {
        set(state.tdpProfiles, `${currentGameId}.tdp`, tdp);
      } else {
        set(state.tdpProfiles, `default.tdp`, tdp);
      }
    },
    updateMinTdp: (state, action: PayloadAction<number>) => {
      state.minTdp = action.payload;
    },
    updateMaxTdp: (state, action: PayloadAction<number>) => {
      state.maxTdp = action.payload;
    },
    updateAdvancedOption: (
      state,
      action: PayloadAction<{ statePath: string; value: any }>
    ) => {
      const { statePath, value } = action.payload;

      set(state, `advanced.${statePath}`, value);

      handleAdvancedOptionsEdgeCases(state, statePath, value);
    },
    updateInitialLoad: (state, action: PayloadAction<InitialStateType>) => {
      const {
        advancedOptions,
        pluginVersionNum,
        supportsCustomAcPowerManagement,
      } = action.payload;
      state.initialLoad = false;
      state.supportsCustomAcPowerManagement = supportsCustomAcPowerManagement;
      state.minTdp = action.payload.minTdp || MIN_TDP_RANGE;
      state.maxTdp = action.payload.maxTdp || 15;
      state.enableTdpProfiles = action.payload.enableTdpProfiles || false;
      if (action.payload.tdpProfiles) {
        merge(state.tdpProfiles, action.payload.tdpProfiles);
      }
      if (pluginVersionNum) {
        state.pluginVersionNum = pluginVersionNum;
      }
      if (advancedOptions) {
        state.advancedOptions = advancedOptions;
        advancedOptions.forEach((option) => {
          set(state, `advanced.${option.statePath}`, option.currentValue);
        });
      }
    },
    updateTdpProfiles: (state, action: PayloadAction<TdpProfiles>) => {
      merge(state.tdpProfiles, action.payload);
    },
    setEnableTdpProfiles: (state, action: PayloadAction<boolean>) => {
      state.enableTdpProfiles = action.payload;
    },
    setCurrentGameInfo: (
      state,
      action: PayloadAction<{ id: string; displayName: string }>
    ) => {
      const { isAcPower, advanced } = state;
      const { id, displayName } = action.payload;

      state.previousGameId = state.currentGameId;
      if (isAcPower && advanced[AdvancedOptionsEnum.AC_POWER_PROFILES]) {
        const newId = `${id}-ac-power`;
        state.currentGameId = newId;
        state.gameDisplayNames[newId] = `(AC) ${displayName}`;

        bootstrapTdpProfile(state, id, newId);
      } else {
        state.currentGameId = id;
        state.gameDisplayNames[id] = displayName;
        bootstrapTdpProfile(state, id);
      }
    },
  },
});

function bootstrapTdpProfile(state: any, id: string, acPowerId?: string) {
  if (acPowerId && !state.tdpProfiles[acPowerId]) {
    const tdpProfile = getDefaultAcProfile(state, id);
    state.tdpProfiles[acPowerId] = tdpProfile;
    return;
  }

  // bootstrap initial TDP profile if it doesn't exist
  if (!state.tdpProfiles[id]) {
    const defaultTdpProfile = clone(state.tdpProfiles.default);
    state.tdpProfiles[id] = defaultTdpProfile;
  }
}

function getDefaultAcProfile(state: any, id: string) {
  if (state.tdpProfiles[id]) {
    // return already existing non-ac profile for game id
    return clone(state.tdpProfiles[id]);
  } else if (state.tdpProfiles[`default-ac-power`]) {
    // return default ac-power profile
    return clone(state.tdpProfiles[`default-ac-power`]);
  } else {
    // return regular default profile
    return clone(state.tdpProfiles.default);
  }
}

export const allStateSelector = (state: any) => state;
export const initialLoadSelector = (state: any) => state.settings.initialLoad;

export const tdpControlEnabledSelector = (state: any) => {
  const { advancedState } = getAdvancedOptionsInfoSelector(state);

  return Boolean(advancedState[AdvancedOptionsEnum.ENABLE_TDP_CONTROL]);
};

// tdp range selectors
export const minTdpSelector = (state: any) => state.settings.minTdp;
export const maxTdpSelector = (state: any) => state.settings.maxTdp;
export const tdpRangeSelector = (state: any) => [
  state.settings.minTdp,
  state.settings.maxTdp,
];

// tdp profile selectors
export const defaultTdpSelector = (state: any) =>
  state.settings.tdpProfiles.default.tdp;

// enableTdpProfiles selectors
export const tdpProfilesEnabled = (state: any) =>
  state.settings.enableTdpProfiles;

export const activeGameIdSelector = (state: RootState) => {
  const { settings } = state;
  const activeGameId = state.settings.currentGameId;

  if (settings.enableTdpProfiles) {
    return activeGameId;
  } else {
    return "default";
  }
};

export const activeTdpProfileSelector = (state: RootState) => {
  const { settings } = state;
  const activeGameId = state.settings.currentGameId;

  if (settings.enableTdpProfiles) {
    const tdpProfile = settings.tdpProfiles[activeGameId];
    return { activeGameId, tdpProfile };
  } else {
    // tdp from default profile
    return {
      activeGameId: "default",
      tdpProfile: settings.tdpProfiles.default,
    };
  }
};

export const getCurrentTdpInfoSelector = (state: RootState) => {
  const { settings } = state;
  const { activeGameId, tdpProfile: activeTdpProfile } =
    activeTdpProfileSelector(state);
  const tdp = activeTdpProfile.tdp;

  if (settings.enableTdpProfiles) {
    // tdp from game tdp profile
    const displayName = get(settings, `gameDisplayNames.${activeGameId}`, "");
    return { id: activeGameId, tdp, displayName };
  } else {
    // tdp from default profile
    return { id: "default", tdp, displayName: "Default" };
  }
};

// GPU selectors

export const getAdvancedOptionsInfoSelector = (state: RootState) => {
  const { advanced, advancedOptions } = state.settings;

  return { advancedState: advanced, advancedOptions };
};

export const getInstalledVersionNumSelector = (state: RootState) => {
  const { pluginVersionNum } = state.settings;

  return pluginVersionNum;
};

export const acPowerSelector = (state: RootState) => state.settings.isAcPower;

export const supportsCustomAcPowerSelector = (state: RootState) =>
  state.settings.supportsCustomAcPowerManagement;

function handleAdvancedOptionsEdgeCases(
  state: any,
  statePath: string,
  value: boolean
) {
  if (
    statePath === AdvancedOptionsEnum.FORCE_DISABLE_TDP_ON_RESUME &&
    value === true
  ) {
    set(state, `advanced.${AdvancedOptionsEnum.MAX_TDP_ON_RESUME}`, false);
  }

  if (statePath === AdvancedOptionsEnum.MAX_TDP_ON_RESUME && value === true) {
    set(
      state,
      `advanced.${AdvancedOptionsEnum.FORCE_DISABLE_TDP_ON_RESUME}`,
      false
    );
  }
}

// Action creators are generated for each case reducer function
export const {
  updateMinTdp,
  updateMaxTdp,
  updateInitialLoad,
  updateTdpProfiles,
  setCurrentGameInfo,
  setEnableTdpProfiles,
  updateAdvancedOption,
  setReduxTdp,
  setAcPower,
} = settingsSlice.actions;

export default settingsSlice.reducer;
