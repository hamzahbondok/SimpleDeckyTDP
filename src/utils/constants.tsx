import {
  getCurrentGameId,
  getCurrentGameInfo,
} from "../components/atoms/DeckyFrontendLib";

export const MIN_TDP_RANGE = 4;
export const DEFAULT_POLL_RATE = 10000;
export const DEFAULT_START_TDP = 12;

export const extractCurrentGameId = getCurrentGameId;

export const extractCurrentGameInfo = getCurrentGameInfo;

const addReverseMapping = (options: { [key: string]: string }) => {
  Object.entries(options).forEach(
    ([label, option]) => (options[option] = label)
  );
};

