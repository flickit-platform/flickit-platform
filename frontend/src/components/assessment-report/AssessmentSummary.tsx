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
}

export const AssessmentSummary = (props: IAssessmentSummaryProps) => {
  const { assessmentKit, expertGroup, pathInfo, data, progress } = props;
  const {
    assessment: { title, lastModificationTime, creationTime },
  } = data;
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height="320px"
      gap={3}
      py={4}
      sx={{
        background: "#fff",
        boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.25)",
        borderRadius: "40px",
        px: { xs: 2, sm: 3 },
      }}
    >
      <Typography color="#3B4F68" fontSize="18px">
        {pathInfo?.space?.title}
      </Typography>
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

      <Box
        sx={{ ...styles.centerV }}
        width="100%"
        justifyContent="space-evenly"
      >
        <Box display="flex" flexDirection="column" textAlign={"center"}>
          <Typography color="#9DA7B3">
            <Trans i18nKey="created" values={{ progress }} />{" "}
          </Typography>
          <Typography color="#9DA7B3">
            {convertToRelativeTime(creationTime)}
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column" textAlign={"center"}>
          <Typography color="#9DA7B3">
            <Trans i18nKey="updated" />
          </Typography>
          <Typography color="#9DA7B3">
            {convertToRelativeTime(lastModificationTime)}
          </Typography>
        </Box>
      </Box>
      <Button
        variant="contained"
        fullWidth
        sx={{
          borderRadius: 4,
          textTransform: "none",
          backgroundColor: "#1CC2C4",
          borderColor: "#1CC2C4",
          color: "#D2F3F3",
          boxShadow: "none",
          "&:hover": {
            backgroundColor: "#1CC2C4",
            borderColor: "#1CC2C4",
          },
        }}
        component={Link}
        to="./../questionnaires"
        disabled={progress === 100 ? true : false}
      >
        <Trans i18nKey="seeQuestionaires" />
      </Button>
    </Box>
  );
};
