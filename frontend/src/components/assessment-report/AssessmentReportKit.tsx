import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import {
  AssessmentKitInfoType,
  ExpertGroupDetails,
  IAssessmentKitReportModel,
  ISubjectInfo,
  PathInfo,
} from "@types";
import Typography from "@mui/material/Typography";
import { getMaturityLevelColors, styles } from "@styles";
import { Link } from "react-router-dom";
import formatDate from "@/utils/formatDate";
import ColorfullProgress from "../common/progress/ColorfulProgress";
import { convertToRelativeTime } from "@/utils/convertToRelativeTime";
import { Avatar, Button, Chip, Divider, Grid } from "@mui/material";
interface IAssessmentReportKit {
  assessmentKit: IAssessmentKitReportModel;
}

export const AssessmentReportKit = (props: IAssessmentReportKit) => {
  const { assessmentKit } = props;
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      maxHeight="100%"
      gap={3}
      py={4}
      sx={{
        background: "#fff",
        boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.25)",
        borderRadius: "40px",
        px: { xs: 2, sm: 3 },
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        flexDirection={{ xs: "column", sm: "row" }}
      >
        <Box display="flex" alignItems="center" gap="2px">
          <Typography color="#3B4F68" fontSize="14px">
            Created with
          </Typography>
          <Chip
            component={Link}
            to={`/assessment-kits/${assessmentKit?.id}`}
            label={assessmentKit.title}
            size="small"
            sx={{
              background: "rgba(210, 243, 243, 1)",
              color: "rgba(28, 194, 196, 1)",
              textTransform: "none",
              cursor: "pointer",
            }}
          />
        </Box>
        <Divider orientation="vertical" flexItem sx={{ marginX: 2 }} />
        <Box display="flex" alignItems="center" gap="2px">
          <Typography color="#3B4F68" fontSize="14px">
            Kit is provided by
          </Typography>
          <Avatar
            component={Link}
            to={`/user/expert-groups/${assessmentKit?.expertGroup.id}`}
            src={assessmentKit.expertGroup.picture}
            sx={{ cursor: "pointer" }}
          ></Avatar>
          <Chip
            component={Link}
            to={`/user/expert-groups/${assessmentKit?.expertGroup.id}`}
            label={assessmentKit.expertGroup.title}
            size="small"
            sx={{
              background: "rgba(210, 243, 243, 1)",
              color: "rgba(28, 194, 196, 1)",
              textTransform: "none",
              cursor: "pointer",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};
