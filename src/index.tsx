import { definePlugin } from "@decky/api";
import { BsCpuFill } from "react-icons/bs";
import { getSettings, setValuesForGameId } from "./backend/utils";
import { store } from "./redux-modules/store";
import {
  acPowerEventListener,
  currentGameInfoListener,
  resumeFromSuspendEventListener,
  suspendEventListener,
} from "./steamListeners";
import { updateInitialLoad } from "./redux-modules/settingsSlice";

import { cleanupAction } from "./redux-modules/extraActions";

import AppContainer from "./App";

export default definePlugin(() => {
  // fetch settings from backend, send into redux state
  getSettings().then((result) => {
    const results = result || {};

    store.dispatch(
      updateInitialLoad({
        ...results,
      })
    );
    setTimeout(() => {
      setValuesForGameId({ gameId: "default" });
    }, 0);
  });

  // const unpatch = steamPatch();

  const unregisterCurrentGameListener = currentGameInfoListener();
  const unregisterResumeFromSuspendListener = resumeFromSuspendEventListener();
  const unregisterSuspendListener = suspendEventListener();

  let unregisterAcPowerListener: any;

  acPowerEventListener().then((unregister) => {
    unregisterAcPowerListener = unregister;
  });

  return {
    name: "SimpleDeckyTDP",
    content: <AppContainer />,
    icon: <BsCpuFill />,
    onDismount: () => {
      try {
        store.dispatch(cleanupAction());
        // if (unpatch) unpatch();
        if (unregisterCurrentGameListener) unregisterCurrentGameListener();
        if (
          unregisterSuspendListener &&
          typeof unregisterSuspendListener === "function"
        )
          unregisterSuspendListener();
        if (
          unregisterResumeFromSuspendListener &&
          typeof unregisterResumeFromSuspendListener === "function"
        )
          unregisterResumeFromSuspendListener();
        if (
          unregisterAcPowerListener &&
          typeof unregisterAcPowerListener === "function"
        )
          unregisterAcPowerListener();
      } catch (e) {
        console.error(e);
      }
    },
  };
});
