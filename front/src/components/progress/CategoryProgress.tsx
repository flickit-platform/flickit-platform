import React from "react";
import Box, { BoxProps } from "@mui/material/Box";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import { QANumberIndicator } from "../QANumberIndicator";
import { styles } from "../../config/styles";

interface ICategoryProgress extends BoxProps {
  progress: number;
  q?: number;
  a?: number;
  isCategory?: boolean;
  isSmallScreen?: boolean;
}

const progressToLabelMap: Record<number, string> = {
  0: "notStarted",
  100: "completed",
};

const progressToColorMap: Record<number, LinearProgressProps["color"]> = {
  0: "inherit",
  100: "success",
};

const progressToColorMapColor: Record<number, string> = {
  0: "gray",
  100: "#2e7d32",
};

export const CategoryProgress = (props: ICategoryProgress) => {
  const { progress = 0, q, a, isCategory, isSmallScreen, ...rest } = props;
  return (
    <Box sx={{ ...styles.centerV }} flex="1" {...rest}>
      <Box flex={1}>
        <LinearProgress
          value={progress}
          color={progressToColorMap[progress] || "primary"}
          variant="determinate"
          sx={{
            borderRadius: "0 8px 8px 0px",
            color: progress === 0 ? "gray" : undefined,
          }}
        />
      </Box>
      <Box pl="8px" mr="-2px">
        {isCategory && isSmallScreen ? (
          <QANumberIndicator q={q} a={a} />
        ) : (
          <Typography
            fontWeight={"bold"}
            textTransform="uppercase"
            color={progressToColorMapColor[progress] || "#1976d2"}
          >
            <Trans i18nKey={progressToLabelMap[progress] || "inprogress"} />
          </Typography>
        )}
      </Box>
    </Box>
  );
};
