import React from "react";
import { Box, BoxProps } from "@mui/material";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import QANumberIndicator from "../QANumberIndicator";
import { styles } from "../../../config/styles";

interface IQuestionnaireProgress extends BoxProps {
  progress: number;
  q?: number;
  a?: number;
  isQuestionnaire?: boolean;
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

const QuestionnaireProgress = (props: IQuestionnaireProgress) => {
  const { progress = 0, q, a, isQuestionnaire, isSmallScreen, ...rest } = props;
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
        {isQuestionnaire && isSmallScreen ? (
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

export default QuestionnaireProgress;
