import { callable, call } from "@decky/api";
import { IS_DESKTOP } from "../components/atoms/DeckyFrontendLib";

export enum AdvancedOptionsEnum {
  ENABLE_TDP_CONTROL = "enableTdpControl",
  AC_POWER_PROFILES = "acPowerProfiles",
  FORCE_DISABLE_TDP_ON_RESUME = "forceDisableTdpOnResume",
  USE_PLATFORM_PROFILE = "platformProfile",
}

export enum AdvancedOptionsType {
  BOOLEAN = 'boolean',
  NUMBER_RANGE = 'number_range'
}



export const DesktopAdvancedOptions = [
  AdvancedOptionsEnum.ENABLE_TDP_CONTROL,
  AdvancedOptionsEnum.AC_POWER_PROFILES,
] as string[];


export enum ServerAPIMethods {
  SET_SETTING = "set_setting",
  GET_SETTINGS = "get_settings",
  LOG_INFO = "log_info",
  SET_TDP = "set_tdp",
  SAVE_TDP = "save_tdp",
  PERSIST_TDP = "persist_tdp",
  ON_SUSPEND = "on_suspend",
  OTA_UPDATE = "ota_update",
  SET_VALUES_FOR_GAME_ID = "set_values_for_game_id",
  GET_IS_STEAM_RUNNING = "is_steam_running",
  GET_SUPPORTS_CUSTOM_AC_POWER_MANAGEMENT = "supports_custom_ac_power_management",
  GET_CURRENT_AC_POWER_STATUS = "get_ac_power_status",
  SET_MAX_TDP = "set_max_tdp",
  GET_LATEST_VERSION_NUM = "get_latest_version_num",
}

export const getSettings = callable<[], any>(ServerAPIMethods.GET_SETTINGS);
export const setSetting = ({ name, value }: { name: string; value: any }) => {
  if (IS_DESKTOP) {
    return call(ServerAPIMethods.SET_SETTING, { name, value });
  }

  return call(ServerAPIMethods.SET_SETTING, name, value);
};
export const onSuspend = callable(ServerAPIMethods.ON_SUSPEND);


export const setMaxTdp = callable(ServerAPIMethods.SET_MAX_TDP);
export const isSteamRunning = callable(ServerAPIMethods.GET_IS_STEAM_RUNNING);

export const logInfo = ({ info }: { info: any }) => {
  return call(ServerAPIMethods.LOG_INFO, { info });
};

export const saveTdpProfiles = ({
  tdpProfiles,
  currentGameId,
  advanced,
}: {
  tdpProfiles: any;
  currentGameId: any;
  advanced: any;
}) => {
  if (IS_DESKTOP) {
    return call(ServerAPIMethods.SAVE_TDP, {
      tdpProfiles,
      currentGameId,
      advanced,
    });
  }
  return call(ServerAPIMethods.SAVE_TDP, tdpProfiles, currentGameId, advanced);
};

export const getLatestVersionNum = callable(
  ServerAPIMethods.GET_LATEST_VERSION_NUM
);

export const otaUpdate = callable(ServerAPIMethods.OTA_UPDATE);


export const getSupportsCustomAcPower = callable(
  ServerAPIMethods.GET_SUPPORTS_CUSTOM_AC_POWER_MANAGEMENT
);

export const getCurrentAcPowerStatus = callable(
  ServerAPIMethods.GET_CURRENT_AC_POWER_STATUS
);


export const persistTdp = ({
  tdp,
  gameId,
}: {
  tdp: number;
  gameId: string;
}) => {
  if (IS_DESKTOP) {
    return call(ServerAPIMethods.PERSIST_TDP, { tdp, gameId });
  }

  return call(ServerAPIMethods.PERSIST_TDP, tdp, gameId);
};

export const setValuesForGameId = ({ gameId }: { gameId: string }) => {
  if (IS_DESKTOP) {
    return call(ServerAPIMethods.SET_VALUES_FOR_GAME_ID, { gameId });
  }

  return call(ServerAPIMethods.SET_VALUES_FOR_GAME_ID, gameId);
};
