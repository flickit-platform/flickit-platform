import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import { AssessmentKitInfoType, ExpertGroupDetails, PathInfo } from "@types";
import Typography from "@mui/material/Typography";
import { styles } from "@styles";
import { Link } from "react-router-dom";
import formatDate from "@/utils/formatDate";
import ColorfullProgress from "../common/progress/ColorfulProgress";
import { convertToRelativeTime } from "@/utils/convertToRelativeTime";
interface IAssessmentSummaryProps {
  assessmentKit: AssessmentKitInfoType;
  expertGroup: ExpertGroupDetails;
  pathInfo: PathInfo;
  data: any;
  progress: number;
}

export const AssessmentSummary = (props: IAssessmentSummaryProps) => {
  const { assessmentKit, expertGroup, pathInfo, data, progress } = props;
  const {
    assessment: { title, lastModificationTime },
  } = data;
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height="100%"
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
          component={Link}
          to={`/assessment-kits/${assessmentKit?.id}`}
          fontSize="38px"
          sx={{
            textDecoration: "none",
          }}
          color="#1CC2C4"
          fontWeight={800}
        >
          {assessmentKit?.title}
        </Typography>
        <Typography color="#9DA7B3">{assessmentKit?.summary}</Typography>
        <Typography
          sx={{
            fontSize: { xs: "0.6rem", md: "0.95rem", textDecoration: "none" },
          }}
          color="#9DA7B3"
          component={Link}
          to={`/user/expert-groups/${expertGroup?.id}`}
        >
          {expertGroup?.title}
        </Typography>
      </Box>

      <ColorfullProgress progress={Math.ceil(progress)} />

      <Box
        component={Link}
        to="./../questionnaires"
        color="#1CC2C4"
        fontWeight={500}
      >
        <Trans i18nKey="seeQuestionaires" />
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
            {formatDate(lastModificationTime)}
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column" textAlign={"center"}>
          <Typography color="#9DA7B3">
            <Trans i18nKey="lastModified" />
          </Typography>
          <Typography color="#9DA7B3">
            {convertToRelativeTime(lastModificationTime)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
