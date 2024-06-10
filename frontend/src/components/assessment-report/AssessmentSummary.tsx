import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import {
  AssessmentKitInfoType,
  ExpertGroupDetails,
  AssessmentKitStatsExpertGroup,
  IAssessmentKitReportModel,
  PathInfo,
} from "@types";
import Typography from "@mui/material/Typography";
import { styles } from "@styles";
import { Link } from "react-router-dom";
import formatDate from "@/utils/formatDate";
import ColorfullProgress from "../common/progress/ColorfulProgress";
import { convertToRelativeTime } from "@/utils/convertToRelativeTime";
import { Button } from "@mui/material";
interface IAssessmentSummaryProps {
  assessmentKit: IAssessmentKitReportModel;
  expertGroup: AssessmentKitStatsExpertGroup;
  pathInfo: PathInfo;
  data: any;
  progress: number;
  questionCount: number;
  answerCount: number;
}

export const AssessmentSummary = (props: IAssessmentSummaryProps) => {
  const {
    assessmentKit,
    expertGroup,
    pathInfo,
    data,
    progress,
    questionCount,
    answerCount,
  } = props;
  const {
    assessment: { title, lastModificationTime, creationTime },
  } = data;
  return (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      gap={3}
      py={4}
      sx={{
        background: "#fff",
        boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.25)",
        borderRadius: "40px",
        px: { xs: 2, sm: 3 },
      }}
      color="#1CC2C4"
    >
      <Box sx={{ ...styles.centerCVH }} gap={1}>
        <Typography
          fontSize="32px"
          sx={{
            textDecoration: "none",
          }}
          color="#1CC2C4"
          fontWeight={800}
        >
          {assessmentKit?.title}
        </Typography>
      </Box>
      <ColorfullProgress
        questionCount={questionCount}
        answerCount={answerCount}
      />
      <Button
        variant="contained"
        sx={{
          borderRadius: "24px",
          textTransform: "none",
          backgroundColor: "#1CC2C4",
          borderColor: "#1CC2C4",
          color: "#fff",
          fontSize: "1.25rem",
          py: "8px",
          boxShadow: "none",
          "&:hover": {
            backgroundColor: "#1CC2C4",
            borderColor: "#1CC2C4",
          },
          width: "65%",
        }}
        size="small"
        component={Link}
        to="./../questionnaires"
      >
        <Trans i18nKey="Questionnaires" />
      </Button>
      <Box
        sx={{ ...styles.centerV }}
        width="100%"
        justifyContent="space-evenly"
      >
        <Box display="flex" flexDirection="column" textAlign={"center"}>
          <Typography color="#9DA7B3">
            <Trans i18nKey="created" values={{ progress }} />{" "}
          </Typography>
          <Typography color="#6C7B8E" fontWeight="bold">
            {convertToRelativeTime(creationTime)}
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column" textAlign={"center"}>
          <Typography color="#9DA7B3">
            <Trans i18nKey="updated" />
          </Typography>
          <Typography color="#6C7B8E" fontWeight="bold">
            {convertToRelativeTime(lastModificationTime)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
