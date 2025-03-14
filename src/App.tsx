import { FC, memo } from "react";
import TdpRange from "./components/molecules/TdpRange";
import { TdpSlider } from "./components/molecules/TdpSlider";
import { store } from "./redux-modules/store";
import { Provider } from "react-redux";
import { TdpProfiles } from "./components/molecules/TdpProfiles";
import {
  useFetchInitialStateEffect,
  useIsInitiallyLoading,
} from "./hooks/useInitialState";
import AdvancedOptions from "./components/molecules/AdvancedOptions";
import ErrorBoundary from "./components/ErrorBoundary";
import { DeckySection } from "./components/atoms/DeckyFrontendLib";
import { useIsDesktop } from "./hooks/desktopHooks";
import { AdvancedOptionsEnum } from "./backend/utils";
import { useAdvancedOption } from "./hooks/useAdvanced";

const App: FC = memo(({}) => {
  useFetchInitialStateEffect();

  const loading = useIsInitiallyLoading();

  const isDesktop = useIsDesktop();
  const tdpControlEnabled = useAdvancedOption(
    AdvancedOptionsEnum.ENABLE_TDP_CONTROL
  );

  return (
    <>
      {!loading && (
        <>
          <DeckySection>
            <TdpProfiles isDesktop={isDesktop} />
            {tdpControlEnabled && (isDesktop) && (
              <>
                <TdpSlider />
              </>
            )}
          </DeckySection>
          {tdpControlEnabled && (
            <>
              <TdpRange />
            </>
          )}
          
        </>
      )}
    </>
  );
});

const AppContainer: FC = ({}) => {
  return (
    <Provider store={store}>
      <ErrorBoundary title="App">
        <App />
      </ErrorBoundary>
    </Provider>
  );
};

export default AppContainer;
