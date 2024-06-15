import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import { Trans } from "react-i18next";
import { styles } from "@styles";

export enum ProgessBarTypes {
  Questioannaire = "questionnaire",
}
interface ISubjectProgressProps {
  numaratur: number;
  denominator: number;
  displayPercent?: boolean;
  type?: ProgessBarTypes;
  guideText?: any;
  progressHeight?: string | number;
}

const progressToColorMap: Record<number, LinearProgressProps["color"]> = {
  34: "error",
  67: "warning",
  100: "inherit",
};

const ColorfulProgress = (props: ISubjectProgressProps) => {
  const {
    numaratur,
    denominator,
    type,
    displayPercent,
    guideText,
    progressHeight,
  } = props;
  const totalProgress = ((numaratur || 0) / (denominator || 1)) * 100;

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
    case "inherit":
      percentColor = "#1CC2C4";
      break;
    default:
      percentColor = "inherit";
  }

  return (
    <Box sx={{ ...styles.centerCVH }} gap={3} width="100%">
      {type === ProgessBarTypes.Questioannaire && (
        <Box display="flex" textAlign="center" color="#9DA7B3" fontWeight={800}>
          <Typography
            component="span"
            fontSize="1rem"
            color="#6C7B8E"
            fontWeight={500}
            lineHeight={2}
          >
            <Trans i18nKey="answeredQuestions" />
          </Typography>
          <Typography
            component="span"
            color={percentColor}
            mx={1}
            fontWeight={800}
            fontSize="1.25rem"
          >
            {numaratur} of {denominator}
          </Typography>
        </Box>
      )}
      <Box display="flex" width="100%" alignItems="center">
        <LinearProgress
          sx={{
            borderRadius: 3,
            width: "100%",
            height: progressHeight ? progressHeight : "12px",
            border: `1px solid ${percentColor}`,
          }}
          value={totalProgress}
          variant="determinate"
          color={color}
        />{" "}
        {guideText && (
          <Typography
            component="span"
            color="black"
            fontWeight={300}
            fontSize={{ md: "0.8rem", xs: "0.5rem" }}
            textAlign="center"
            sx={{
              position: "absolute",
              left: { md: "26%", xs: "34%", sm: "34%" },
              top: { md: "50%", xs: "26%", sm: "26%" },
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
            }}
          >
            {guideText}
          </Typography>
        )}
        {displayPercent && (
          <Typography
            component="span"
            color={percentColor}
            mx="0.5rem"
            fontWeight={300}
            fontSize="1rem"
            width="1rem"
          >
            {totalProgress != null && Math.ceil(totalProgress)}
            {totalProgress != null ? "%" : ""}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ColorfulProgress;
