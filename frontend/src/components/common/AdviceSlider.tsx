import React, { useState } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { getMaturityLevelColors } from "@styles";
import { Trans } from "react-i18next";
const AdviceSlider = (props: any) => {
  const {
    defaultValue,
    attribute,
    subject,
    maturityLevels,
    setTarget,
    target,
    currentState,
  } = props;
  const [value, setValue] = useState();
  const handleSliderChange = (event: Event, newValue: any) => {
    if (newValue >= defaultValue) {
      setValue(newValue);
      const existingIndex = target.findIndex(
        (item: any) => item.attributeId === attribute?.id
      );

      if (existingIndex === -1) {
        // If the attributeId doesn't exist, add a new object
        setTarget((prev: any) => [
          ...prev,
          {
            attributeId: attribute?.id,
            maturityLevelId: maturityLevels[newValue - 1]?.id,
          },
        ]);
      } else {
        // If the attributeId exists, update the existing object
        setTarget((prev: any) => {
          const updatedTarget = [...prev];
          updatedTarget[existingIndex] = {
            attributeId: attribute?.id,
            maturityLevelId: maturityLevels[newValue - 1]?.id,
          };
          return updatedTarget;
        });
      }
    }
  };
  const colorPallet = getMaturityLevelColors(
    subject?.maturity_level?.maturity_levels_count ?? 5
  );
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: { xs: 3, sm: 8 },
        width: "100%",
        margin: "0 auto",
        flexDirection: { xs: "column", sm: "row" },
        mb: { xs: 4, sm: 2 },
      }}
    >
      <Box sx={{ display: "contents" }}>
        <Box
          sx={{
            px: "10px",
            color: "#D81E5B",
            background: "#FDF1F5",
            fontSize: ".75rem",
            border: "1px solid #D81E5B",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          {subject.title}
        </Box>
        <Box
          sx={{
            fontSize: "1.5rem",
            fontWeight: "500",
            ml: { xs: 0, sm: 4 },
            width: { xs: "100%", sm: "240px" },
            px: "8px",
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          {attribute.title}
        </Box>
      </Box>

      <Box
        sx={{ width: { xs: "100%", sm: "400px" } }}
        margin={"0 auto"}
        my={{ xs: 2, sm: 6 }}
      >
        <Box px={2}>
          <Slider
            defaultValue={defaultValue}
            min={1}
            max={subject?.maturity_level?.maturity_levels_count ?? 5}
            onChange={handleSliderChange}
            value={value}
            marks
            sx={{
              ".MuiSlider-thumb": {
                color: "#004F83",
              },
              ".MuiSlider-track": {
                border: "none",
                height: "4px",
                backgroundColor: "#004F83",
              },
              ".MuiSlider-rail": {
                opacity: 0.5,
                height: "4px",
                backgroundColor: "#004F83 !important",
              },
              ".MuiSlider-markActive": {
                background: "rgba(237, 244, 252, 1)",
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
          mt={"-10px"}
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
              left: `${(defaultValue - 1) * 25}%`,
              ml: "-25px",
              mt: "-5px",
              whiteSpace: "nowrap",
              fontSize: ".75rem",
              fontWeight: "400",
              color: "#F9A03F",
            }}
          >
            <Trans i18nKey="currentStage" />
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          width: "100px",
        }}
      >
        <Box
          sx={{
            color: "#9DA7B3",
            fontSize: ".75rem",
            fontWeight: "400",
          }}
        >
          <Trans i18nKey="from" />
        </Box>
        <Box
          sx={{
            color: colorPallet[currentState?.index - 1],
            fontSize: ".75rem",
            fontWeight: "700",
          }}
        >
          {currentState?.title}
        </Box>
        <Box
          sx={{
            color: "#9DA7B3",
            fontSize: ".75rem",
            fontWeight: "400",
          }}
        >
          <Trans i18nKey="to" />
        </Box>

        <Box
          sx={{
            color: colorPallet[value ? value - 1 : defaultValue - 1],
            fontSize: "1rem",
            fontWeight: "700",
          }}
        >
          {maturityLevels[value ? value - 1 : defaultValue - 1]?.title}
        </Box>
      </Box>
    </Box>
  );
};

export default AdviceSlider;
