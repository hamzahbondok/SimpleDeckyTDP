// tdp range
// import { useEffect } from 'react'
import TdpRangeSlider from "../atoms/TdpRangeSlider";
import { useMinTdp, useMaxTdp } from "../../hooks/useTdpRange";
import { useIsSteamPatchEnabled } from "./AdvancedOptions";
import { CpuVendors, MIN_TDP_RANGE } from "../../utils/constants";
import ErrorBoundary from "../ErrorBoundary";
import { DeckyRow, DeckySection } from "../atoms/DeckyFrontendLib";
import { useSelector } from "react-redux";
import { cpuVendorSelector } from "../../redux-modules/settingsSlice";

const TdpRange = () => {
  const [minTdp, setMinTdp] = useMinTdp();
  const [maxTdp, setMaxTdp] = useMaxTdp();

  const steamPatchEnabled = useIsSteamPatchEnabled();
  const cpuVendor = useSelector(cpuVendorSelector);

  if (cpuVendor === CpuVendors.INTEL) {
    // intel provides TDP limit values, custom TDP range is unnecessary
    return null;
  }

  const title = steamPatchEnabled ? "Steam TDP Slider range" : "TDP Range";

  return (
    <DeckySection title={title}>
      <ErrorBoundary title="Tdp Range">
        <DeckyRow>
          <TdpRangeSlider
            tdpRange={[MIN_TDP_RANGE, 12]}
            label="Minimum TDP"
            value={minTdp}
            onChange={setMinTdp}
          />
        </DeckyRow>
        <DeckyRow>
          <TdpRangeSlider
            tdpRange={[15, 40]}
            label="Max TDP"
            value={maxTdp}
            onChange={setMaxTdp}
          />
        </DeckyRow>
      </ErrorBoundary>
    </DeckySection>
  );
};

export default TdpRange;
