import React from "react";
import { Avatar, Box, CardHeader, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import QueryData from "../shared/QueryData";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "../../utils/useQuery";
import { AssessmentSubjectList } from "./AssessmentSubjectList";
import { useServiceContext } from "../../providers/ServiceProvider";
import { AssessmentOverallStatus } from "./AssessmentOverallStatus";
import { AssessmentMostSignificantAttributes } from "./AssessmentMostSignificantAttributes";
import LoadingSkeletonOfAssessmentReport from "../shared/loadings/LoadingSkeletonOfAssessmentReport";
import AssessmentReportTitle from "./AssessmentReportTitle";
import { IAssessmentReportModel } from "../../types";
import QuestionnairesNotCompleteAlert from "../questionnaires/QuestionnairesNotCompleteAlert";
import { Trans } from "react-i18next";
import { styles } from "../../config/styles";

const AssessmentReportContainer = () => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();

  const queryData = useQuery<IAssessmentReportModel>({
    service: (args, config) => service.fetchAssessment({ assessmentId }, config),
    toastError: true,
    toastErrorOptions: { filterByStatus: [404] },
  });

  return (
    <QueryData
      {...queryData}
      renderLoading={() => <LoadingSkeletonOfAssessmentReport />}
      render={(data) => {
        const {
          assessment_project,
          status,
          most_significant_weaknessness_atts,
          most_significant_strength_atts,
          subjects_info = [],
          total_progress,
        } = data || {};
        const colorCode = assessment_project?.color?.color_code || "#101c32";
        const isComplete = total_progress.progress === 100;
        const { assessment_profile } = assessment_project || {};
        const { expert_group } = assessment_profile || {};

        return (
          <Box m="auto" pb={3} maxWidth="1440px">
            <AssessmentReportTitle data={data} colorCode={colorCode} />
            {!isComplete && (
              <Box mt={3}>
                <QuestionnairesNotCompleteAlert
                  progress={total_progress.progress}
                  to="./../questionnaires"
                  q={total_progress.total_metric_number}
                  a={total_progress.total_answered_metric_number}
                />
              </Box>
            )}
            <Box mt={3}>
              <Paper elevation={2} sx={{ borderRadius: 3, height: "100%" }}>
                <Box py={2} sx={{ px: 3, ...styles.centerV }}>
                  <Box
                    sx={{
                      ...styles.centerCV,
                      textDecoration: "none",
                    }}
                    alignSelf="stretch"
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: {
                          xs: "1.05rem",
                          sm: "1.1rem",
                          md: "1.3rem",
                          fontFamily: "Roboto",
                        },
                        fontWeight: "bold",
                        textDecoration: "none",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        alignSelf: "stretch",
                      }}
                    >
                      <Trans i18nKey="theProfileUsedInThisAssessmentIs" />{" "}
                      <Box
                        component={Link}
                        to={`/profiles/${assessment_profile?.id}`}
                        sx={{ color: (t) => t.palette.primary.dark, textDecoration: "none", ml: 0.5 }}
                      >
                        {assessment_profile?.title}
                      </Box>
                    </Typography>
                    <Typography color="GrayText" variant="body2">
                      {assessment_profile?.summary}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      ml: "auto",
                      mr: 2,
                      textDecoration: "none",
                    }}
                    component={Link}
                    to={`/account/expert-groups/${expert_group?.id}`}
                  >
                    <Typography color="grayText" variant="subLarge">
                      <Trans i18nKey="providedBy" />
                    </Typography>
                    <CardHeader
                      sx={{ p: 0, ml: 1.8 }}
                      titleTypographyProps={{
                        sx: { textDecoration: "none" },
                      }}
                      avatar={<Avatar alt={expert_group?.name} src={expert_group?.picture || "/"} />}
                      title={
                        <Box component={"b"} fontSize=".95rem" color="Gray">
                          {expert_group?.name}
                        </Box>
                      }
                    />
                  </Box>
                </Box>
              </Paper>
            </Box>
            <Grid container spacing={3} columns={14} mt={0.2}>
              <Grid item lg={8} md={14} sm={14} xs={14}>
                <AssessmentOverallStatus status={status} subjects={subjects_info} />
              </Grid>
              <Grid item lg={3} md={7} sm={14} xs={14}>
                <AssessmentMostSignificantAttributes isWeakness={false} most_significant_items={most_significant_strength_atts} />
              </Grid>
              <Grid item lg={3} md={7} sm={14} xs={14}>
                <AssessmentMostSignificantAttributes
                  isWeakness={true}
                  most_significant_items={most_significant_weaknessness_atts}
                />
              </Grid>
              <Grid item sm={14} xs={14} id="subjects">
                <AssessmentSubjectList subjects={subjects_info} colorCode={colorCode} />
              </Grid>
            </Grid>
          </Box>
        );
      }}
    />
  );
};

export default AssessmentReportContainer;
