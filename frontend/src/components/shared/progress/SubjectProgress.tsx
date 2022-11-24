import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import { Trans } from "react-i18next";

interface ISubjectProgressProps {
  progress: number;
  colorCode: string;
}

const progressToLabelMap: Record<number, string> = {
  0: "notStarted",
  100: "completed",
};

const SubjectProgress = (props: ISubjectProgressProps) => {
  const { progress, colorCode } = props;

  return (
    <Box mt={9} mb={4}>
      <LinearProgress
        sx={{ borderRadius: 3 }}
        value={progress}
        variant="determinate"
        color="inherit"
      />
      <Typography
        sx={{
          mt: 1,
          opacity: 0.7,
          fontFamily: "OswaldRegular",
          color: colorCode
            ? (t) => t.palette.getContrastText(colorCode)
            : "white",
        }}
        variant="h6"
        textTransform={"uppercase"}
      >
        <Trans i18nKey={progressToLabelMap[progress] || "inprogress"} />
      </Typography>
    </Box>
  );
};

export default SubjectProgress;
