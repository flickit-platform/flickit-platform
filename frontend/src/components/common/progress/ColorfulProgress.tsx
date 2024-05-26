import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import { Trans } from "react-i18next";
import { styles } from "@styles";

interface ISubjectProgressProps {
  answerCount: number;
  questionCount: number;
}

const progressToColorMap: Record<number, LinearProgressProps["color"]> = {
  34: "error",
  67: "warning",
  100: "success",
};

const ColorfulProgress = (props: ISubjectProgressProps) => {
  const { answerCount, questionCount } = props;
  const totalProgress = ((answerCount || 0) / (questionCount || 1)) * 100;

  let color: LinearProgressProps["color"] = "primary";
  for (const key in progressToColorMap) {
    if (totalProgress <= parseInt(key)) {
      color = progressToColorMap[key];
      break;
    }
  }

  let percentColor: string;
  switch (color) {
    case "error":
      percentColor = "#D81E5B";
      break;
    case "warning":
      percentColor = "orange";
      break;
    case "success":
      percentColor = "#1CC2C4";
      break;
    default:
      percentColor = "inherit";
  }

  return (
    <Box sx={{ ...styles.centerCVH }} gap={1} width="80%">
      <Box display="flex" textAlign="center" color="#9DA7B3" fontWeight={800}>
        <Typography component="span">
          <Trans i18nKey="answeredQuestions" />
        </Typography>
        <Typography
          component="span"
          color={percentColor}
          mx={1}
          fontWeight={800}
        >
          {answerCount} of {questionCount}
        </Typography>
      </Box>
      <LinearProgress
        sx={{
          borderRadius: 3,
          width: "100%",
          height: "12px",
          border: `1px solid ${percentColor}`,
        }}
        value={totalProgress}
        variant="determinate"
        color={color}
      />
    </Box>
  );
};

export default ColorfulProgress;
