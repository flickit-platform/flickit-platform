import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import QueryData from "../shared/QueryData";
import { useParams } from "react-router-dom";
import { useQuery } from "../../utils/useQuery";
import { AssessmentSubjectList } from "./AssessmentSubjectList";
import { useServiceContext } from "../../providers/ServiceProvider";
import { AssessmentOverallStatus } from "./AssessmentOverallStatus";
import { AssessmentMostSignificantAttributes } from "./AssessmentMostSignificantAttributes";
import LoadingSkeletonOfAssessmentReport from "../shared/loadings/LoadingSkeletonOfAssessmentReport";
import AssessmentReportTitle from "./AssessmentReportTitle";
import { IAssessmentReportModel } from "../../types";
import QuestionnairesNotCompleteAlert from "../questionnaires/QuestionnairesNotCompleteAlert";

const AssessmentReportContainer = () => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();

  const queryData = useQuery<IAssessmentReportModel>({
    service: (args, config) =>
      service.fetchAssessment({ assessmentId }, config),
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
            <Grid container spacing={3} columns={14} mt={1}>
              <Grid item lg={8} md={14} sm={14} xs={14}>
                <AssessmentOverallStatus
                  status={status}
                  subjects={subjects_info}
                />
              </Grid>
              <Grid item lg={3} md={7} sm={14} xs={14}>
                <AssessmentMostSignificantAttributes
                  isWeakness={false}
                  most_significant_items={most_significant_strength_atts}
                />
              </Grid>
              <Grid item lg={3} md={7} sm={14} xs={14}>
                <AssessmentMostSignificantAttributes
                  isWeakness={true}
                  most_significant_items={most_significant_weaknessness_atts}
                />
              </Grid>
              <Grid item sm={14} xs={14} id="subjects">
                <AssessmentSubjectList
                  subjects={subjects_info}
                  colorCode={colorCode}
                />
              </Grid>
            </Grid>
          </Box>
        );
      }}
    />
  );
};

export default AssessmentReportContainer;
