import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import { Trans } from "react-i18next";
import { styles } from "@styles";

interface ISubjectProgressProps {
  progress: number;
}

const progressToColorMap: Record<number, LinearProgressProps["color"]> = {
  34: "error",
  67: "warning",
  100: "success",
};

const ColorfulProgress = (props: ISubjectProgressProps) => {
  const { progress } = props;

  let color: LinearProgressProps["color"] = "primary";
  for (const key in progressToColorMap) {
    if (progress <= parseInt(key)) {
      color = progressToColorMap[key];
      break;
    }
  }

  let percentColor: string;
  switch (color) {
    case "error":
      percentColor = "red";
      break;
    case "warning":
      percentColor = "orange";
      break;
    case "success":
      percentColor = "green";
      break;
    default:
      percentColor = "inherit";
  }

  return (
    <Box sx={{ ...styles.centerCVH }} gap={1}>
      <Typography
        display="flex"
        textAlign="center"
        color="#9DA7B3"
        fontWeight={800}
      >
        <Trans i18nKey="totalProgressWithPercent" />
        <Typography color={percentColor} mx={1} fontWeight={800}>
          {Math.ceil(progress)}%
        </Typography>
      </Typography>
      <LinearProgress
        sx={{ borderRadius: 3, width: "300px", height: "12px" }}
        value={progress}
        variant="determinate"
        color={color}
      />
    </Box>
  );
};

export default ColorfulProgress;
