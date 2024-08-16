import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import { Trans } from "react-i18next";

interface ISubjectProgressProps {
  progress: number;
  inProgress?: boolean;
}

const progressToLabelMap: Record<number, string> = {
  0: "notStarted",
  100: "completed",
};

const SubjectProgress = (props: ISubjectProgressProps) => {
  const { progress, inProgress } = props;

  return (
    <Box mt={9} mb={4}>
      {inProgress ? (
        <Box>
          <LinearProgress sx={{ borderRadius: 3 }} color="inherit" />
        </Box>
      ) : (
        <Box>
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
              fontWeight: 400,
              color: "#000000de",
            }}
            variant="h6"
            textTransform={"uppercase"}
          >
            <Trans i18nKey={progressToLabelMap[progress] || "inprogress"} />
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SubjectProgress;
