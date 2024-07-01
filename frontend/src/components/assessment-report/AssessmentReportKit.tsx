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
      <Grid container alignItems="stretch" sx={{ gap: { lg: 1, md: 1 } }}>
        <Grid
          item
          lg={3.8}
          md={6}
          sm={12}
          xs={12}
          sx={{
            ...styles.centerVH,
            flexDirection: { xs: "column", sm: "row" },
          }}
          gap={1}
        >
          <Typography color="#243342" fontSize={"0.9rem"}>
            <Trans i18nKey="createdWith" />
          </Typography>
          <Chip
            component={Link}
            to={`/assessment-kits/${assessmentKit?.id}`}
            label={assessmentKit.title}
            size="medium"
            sx={{
              background: "#D0ECFF",
              height: "fit-content",
              color: "#00365C",
              textTransform: "none",
              cursor: "pointer",
              "& .MuiChip-label": {
                fontSize: "1.125rem",
                whiteSpace: "pre-wrap",
              },
            }}
          />
        </Grid>
        <Divider orientation="vertical" flexItem />

        <Grid
          item
          lg={3.8}
          md={5}
          sm={12}
          xs={12}
          sx={{ ...styles.centerVH, my: 4 }}
          gap={1}
        >
          <Typography
            color="#243342"
            fontSize="0.9rem"
            sx={{ wordBreak: "break-all", px: 2 }}
          >
            {assessmentKit.summary}
          </Typography>
        </Grid>
        <Divider
          orientation="vertical"
          flexItem
          sx={{ display: { md: "none", lg: "block" } }}
        />

        <Grid
          item
          lg={3.9}
          md={12}
          sm={12}
          xs={12}
          sx={{
            ...styles.centerVH,
            flexDirection: { xs: "column", sm: "row" },
          }}
          gap={1}
        >
          <Typography color="#243342" fontSize="0.9rem">
            <Trans i18nKey="kitIsProvidedBy" />
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
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
              size="medium"
              sx={{
                background: "#D0ECFF",
                color: "#00365C",
                textTransform: "none",
                height: "fit-content",
                mx: 1,
                cursor: "pointer",
                "& .MuiChip-label": {
                  fontSize: "1.125rem",
                  whiteSpace: "pre-wrap",
                },
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
