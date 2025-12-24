import { useState } from "react";

import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const RangeSlides = () => {
  const [sliderValue, setSliderValue] = useState(0);

  const handleChange = (value:any) => {
    setSliderValue(value);
  };
  const [sliderValueDefault, setSliderValueDefault] = useState(0);

  const handleChangeDefault = (value:any) => {
    setSliderValueDefault(value);
  };
  const [sliderValues, setSliderValues] = useState([200, 800]);

  const handleSliderChange = (values:any) => {
    setSliderValues(values);
  };

  const [sliderValuesRange, setSliderValuesRange] = useState([-500, 500]);

  const handleSliderChangeRange = (values:any) => {
    setSliderValuesRange(values);
  };
  const [sliderValuesStep, setSliderValuesStep] = useState([-500, 500]);

  const handleSliderChangeStep = (values:any) => {
    setSliderValuesStep(values);
  };

  const [sliderValueCustomValue, setSliderValueCustomValue] = useState([0, 5]);

  const handleSliderChangeCustomValue = (values:any) => {
    setSliderValueCustomValue(values);
  };
  const [sliderValueModernSkin, setSliderValueModernSkin] = useState(30);

  const handleSliderChangeModernSkin = (value:any) => {
    setSliderValueModernSkin(value);
  };
  const [sliderValueSharpeSkin] = useState(30);

  const handleSliderChangeSharpeSkin = (value:any) => {
    setSliderValue(value);
  };
  const [sliderValueRoundSkin, setSliderValueRoundSkin] = useState(30);

  const handleSliderChangeRoundSkin = (value:any) => {
    setSliderValueRoundSkin(value);
  };
  const [sliderValueSquareSkin, setSliderValueSquareSkin] = useState(30);

  const handleSliderChangeSquareSkin = (value:any) => {
    setSliderValueSquareSkin(value);
  };

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
      
      </div>
      {/* /Main Wrapper */}
    </>
  );
};

export default RangeSlides;
