import React, { useState } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
const AdviceSlider = (props: any) => {
  const IOSSlider = styled(Slider)(({ theme }) => ({
    "& .MuiSlider-thumb": {
      color: "#1CC2C4",
    },
    "& .MuiSlider-track": {
      border: "none",
      height: "4px",
      backgroundColor: "#1CC2C4",
    },
    "& .MuiSlider-rail": {
      opacity: 0.5,
      height: "4px",
      backgroundColor: "#1CC2C4 !important",
    },
  }));
  const { defaultValue } = props;
  const marks = [
    {
      value: 1,
      label: "Level 1",
    },
    {
      value: 2,
      label: "Level 2",
    },
    {
      value: 3,
      label: "Level 3",
    },
    {
      value: 4,
      label: "Level 4",
    },
    {
      value: 5,
      label: "Level 5",
    },
  ];
  const [value, setValue] = useState<number>(defaultValue);
  const handleChange = (event: Event, newValue: number | number[]) => {
    // Prevent the user from selecting a value under the default value
    const defaultValue: number = 2; // Set your default value here

    if (Array.isArray(newValue)) {
      // Handle case where multiple values are selected (not applicable to your scenario)
      return;
    }

    const newValueAdjusted: number = Math.max(newValue, defaultValue);
    setValue(newValueAdjusted);
  };
  return (
    <Box width={"400px"} margin={"0 auto"} my={6}>
      <Box px={2}>
        <IOSSlider
          aria-label="Restricted values"
          //   value={value}
          //   onChange={handleChange}
          defaultValue={defaultValue}
          valueLabelDisplay="off"
          step={1}
          marks
          min={1}
          max={5}
          sx={{
            "&.MuiSlider-thumb": { backgroundColor: "red" },
            "& .MuiSlider-rail": {
              opacity: 0.5,
              boxShadow: "inset 0px 0px 4px -2px #000",
              backgroundColor: "#d0d0d0",
            },
          }}
        />
      </Box>
      <Box
        display={"flex"}
        flexDirection={"column"}
        marginTop={"-5px"}
        width={"92%"}
        ml={"1.5%"}
        mr={"4%"}
      >
        <Box position={"relative"} left={`${(defaultValue - 1) * 25}%`}>
          <svg
            width="20"
            height="9"
            viewBox="0 0 20 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M20 9L10 0L0 9H20Z" fill="#F9A03F" />
          </svg>
        </Box>
        <Box
          sx={{
            position: "relative",
            right: "28px",
            whiteSpace: "nowrap",
            fontSize: "12px",
            fontWeight: "400",
            color: "#F9A03F",
          }}
        >
          current stage
        </Box>
      </Box>
    </Box>
  );
};

export default AdviceSlider;
