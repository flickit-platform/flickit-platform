import { useEffect } from "react";
import { Box, Divider, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import QueryBatchData from "@common/QueryBatchData";
import { useParams } from "react-router-dom";
import { useQuery } from "@utils/useQuery";
import { AssessmentSubjectList } from "./AssessmentSubjectList";
import { useServiceContext } from "@providers/ServiceProvider";
import { AssessmentOverallStatus } from "./AssessmentOverallStatus";
import LoadingSkeletonOfAssessmentReport from "@common/loadings/LoadingSkeletonOfAssessmentReport";
import AssessmentReportTitle from "./AssessmentReportTitle";
import { IAssessmentReportModel } from "@types";
import AssessmentAdviceContainer from "./AssessmentAdviceContainer";
import { AssessmentSummary } from "./AssessmentSummary";
import { AssessmentSubjectStatus } from "./AssessmentSubjectStatus";
import { AssessmentReportKit } from "./AssessmentReportKit";
import { AssessmentProgress } from "./AssessmentProgress";
import { Trans } from "react-i18next";
import { styles } from "@styles";
const AssessmentReportContainer = (props: any) => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();

  const queryData = useQuery<IAssessmentReportModel>({
    service: (args, config) =>
      service.fetchAssessment({ assessmentId }, config),
    toastError: false,
    toastErrorOptions: { filterByStatus: [404] },
  });
  const calculateMaturityLevelQuery = useQuery({
    service: (args = { assessmentId }, config) =>
      service.calculateMaturityLevel(args, config),
    runOnMount: false,
  });
  const calculateConfidenceLevelQuery = useQuery({
    service: (args = { assessmentId }, config) =>
      service.calculateConfidenceLevel(args, config),
    runOnMount: false,
  });
  const assessmentTotalProgress = useQuery({
    service: (args, config) =>
      service.fetchAssessmentTotalProgress(
        { assessmentId, ...(args || {}) },
        config
      ),
  });
  const fetchPathInfo = useQuery({
    service: (args, config) =>
      service.fetchPathInfo({ assessmentId, ...(args || {}) }, config),
    runOnMount: true,
  });
  const calculate = async () => {
    try {
      await calculateMaturityLevelQuery.query();
      await queryData.query();
    } catch (e) {}
  };
  const calculateConfidenceLevel = async () => {
    try {
      await calculateConfidenceLevelQuery.query();
      await queryData.query();
    } catch (e) {}
  };
  useEffect(() => {
    if (queryData.errorObject?.response?.data?.code == "CALCULATE_NOT_VALID") {
      calculate();
    }
    if (
      queryData.errorObject?.response?.data?.code ==
      "CONFIDENCE_CALCULATION_NOT_VALID"
    ) {
      calculateConfidenceLevel();
    }
  }, [queryData.errorObject]);

  return (
    <QueryBatchData
      queryBatchData={[queryData, assessmentTotalProgress, fetchPathInfo]}
      renderLoading={() => <LoadingSkeletonOfAssessmentReport />}
      render={([data = {}, progress, pathInfo = {}]) => {
        const { status, assessment, subjects, topStrengths, topWeaknesses } =
          data || {};
        const colorCode = assessment?.color?.code || "#101c32";
        const { assessmentKit, maturityLevel, confidenceValue } =
          assessment || {};
        const { expertGroup } = assessmentKit || {};
        const { questionsCount, answersCount } = progress;

        const totalProgress =
          ((answersCount || 0) / (questionsCount || 1)) * 100;
        return (
          <Box m="auto" pb={3} sx={{ px: { lg: 14, xs: 2, sm: 3 } }}>
            <AssessmentReportTitle
              data={data}
              colorCode={colorCode}
              pathInfo={pathInfo}
            />
            <Grid container spacing={2} columns={12} mt={0.2}>
              <Grid item sm={12} xs={12}>
                <Box
                  sx={{ ...styles.centerCVH }}
                  marginY={4}
                  gap={2}
                  textAlign="center"
                >
                  <Typography color="#9DA7B3" fontSize="44px" fontWeight={900}>
                    <Trans i18nKey="assessmentInsight" />
                  </Typography>
                </Box>
                <Grid container alignItems="stretch" spacing={5}>
                  <Grid item lg={5} md={6} sm={12} xs={12}>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Typography color="#9DA7B3" marginX={4}>
                        <Trans i18nKey="general" />
                      </Typography>
                      <AssessmentSummary
                        expertGroup={expertGroup}
                        assessmentKit={assessment}
                        pathInfo={pathInfo}
                        data={data}
                        progress={totalProgress}
                        questionCount={questionsCount}
                        answerCount={answersCount}
                      />
                    </Box>
                  </Grid>
                  <Grid item lg={7} md={6} sm={12} xs={12}>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Typography color="#9DA7B3" marginX={4}>
                        <Trans i18nKey="overallStatus" />
                      </Typography>
                      <AssessmentOverallStatus
                        status={status}
                        subjects_info={subjects}
                        maturity_level={maturityLevel}
                        maturity_level_count={assessmentKit?.maturityLevelCount}
                        confidence_value={confidenceValue}
                      />
                    </Box>
                  </Grid>
                  {/* <Grid item lg={4} md={12} sm={12} xs={12}>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Typography color="#9DA7B3" marginX={4}>
                        <Trans i18nKey="subjectStatus" />
                      </Typography>
                      <AssessmentSubjectStatus subjects={subjects} />
                    </Box>
                  </Grid> */}
                </Grid>
              </Grid>

              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Box display="flex" flexDirection="column" gap={1}>
                  <Typography color="#9DA7B3" marginX={4}>
                    <Trans i18nKey="assessmentKit" />
                  </Typography>
                  <AssessmentReportKit assessmentKit={assessmentKit} />
                </Box>
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Box sx={{ ...styles.centerCVH }} marginTop={6} gap={2}>
                  <Typography color="#9DA7B3" fontSize="28px" fontWeight="bold">
                    <Trans i18nKey="subjectReport" />
                  </Typography>
                  <Divider sx={{ width: "100%" }} />
                </Box>
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12} id="subjects">
                <AssessmentSubjectList
                  subjects={subjects}
                  colorCode={colorCode}
                />
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Box sx={{ ...styles.centerCVH }} marginTop={6} gap={2}>
                  <Typography color="#9DA7B3" fontSize="28px" fontWeight="bold">
                    <Trans i18nKey="advices" />
                  </Typography>
                  <Divider sx={{ width: "100%" }} />
                </Box>
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12} id="advices">
                <AssessmentAdviceContainer subjects={subjects} />
              </Grid>
            </Grid>
          </Box>
        );
      }}
    />
  );
};

export default AssessmentReportContainer;
