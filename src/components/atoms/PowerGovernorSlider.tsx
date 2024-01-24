// TDP Range Slider
import { SliderField, NotchLabel } from "decky-frontend-lib";
import { useDispatch, useSelector } from "react-redux";
import {
  getPowerControlInfoSelector,
  updatePowerGovernor,
} from "../../redux-modules/settingsSlice";
import {
  PowerGovernorOption,
  PowerGovernorOptions,
} from "../../utils/constants";
import { capitalize } from "lodash";
import { logInfo } from "../../backend/utils";

const getOptions = (powerGovernorOptions: PowerGovernorOption[]) => {
  const idxToOption = {};
  const optionToIdx = {};

  Object.values(PowerGovernorOptions).forEach((option, idx) => {
    if (powerGovernorOptions.includes(option)) {
      idxToOption[idx] = option;
      optionToIdx[option] = idx;
    }
  });

  const notchLabels: NotchLabel[] = [];

  Object.entries(PowerGovernorOptions).forEach(([label, value], idx) => {
    if (powerGovernorOptions.includes(value)) {
      notchLabels.push({
        notchIndex: idx,
        label: capitalize(label.replace("_", " ")),
        value: idx,
      });
    }
  });

  return { idxToOption, optionToIdx, notchLabels };
};

const PowerGovernorSlider = () => {
  const { powerGovernor, powerGovernorOptions } = useSelector(
    getPowerControlInfoSelector
  );
  const dispatch = useDispatch();

  logInfo(powerGovernorOptions);

  const { idxToOption, optionToIdx, notchLabels } =
    getOptions(powerGovernorOptions);

  const handleSliderChange = (value: number) => {
    const powerGovernorOption = idxToOption[value];
    return dispatch(updatePowerGovernor(powerGovernorOption));
  };

  const sliderValue = optionToIdx[powerGovernor];

  return (
    <SliderField
      label="Power Governor"
      value={sliderValue || optionToIdx["powersave"]}
      min={0}
      max={notchLabels.length - 1}
      step={1}
      notchCount={notchLabels.length}
      notchLabels={notchLabels}
      notchTicksVisible={true}
      showValue={false}
      bottomSeparator={"none"}
      onChange={handleSliderChange}
    />
  );
};

export default PowerGovernorSlider;
