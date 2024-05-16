import { useEffect } from "react";
import { Avatar, Box, CardHeader, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import QueryBatchData from "@common/QueryBatchData";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@utils/useQuery";
import { AssessmentSubjectList } from "./AssessmentSubjectList";
import { useServiceContext } from "@providers/ServiceProvider";
import { AssessmentOverallStatus } from "./AssessmentOverallStatus";
import { AssessmentMostSignificantAttributes } from "./AssessmentMostSignificantAttributes";
import LoadingSkeletonOfAssessmentReport from "@common/loadings/LoadingSkeletonOfAssessmentReport";
import AssessmentReportTitle from "./AssessmentReportTitle";
import { IAssessmentReportModel } from "@types";
import QuestionnairesNotCompleteAlert from "../questionnaires/QuestionnairesNotCompleteAlert";
import { Trans } from "react-i18next";
import { styles } from "@styles";
import AssessmentAdviceContainer from "./AssessmentAdviceContainer";

const AssessmentReportContainer = () => {
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
      render={([data = {}, progress = {}, pathInfo = {}]) => {
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
          <Box m="auto" pb={3} maxWidth="1440px">
            <AssessmentReportTitle
              data={data}
              colorCode={colorCode}
              pathInfo={pathInfo}
            />

            {/* <Box mt={3}>
              <QuestionnairesNotCompleteAlert
                progress={totalProgress}
                to="./../questionnaires"
                q={questionsCount}
                a={answersCount}
              />
            </Box> */}
{/* 
            <Box mt={3}>
              <Paper elevation={2} sx={{ borderRadius: 3, height: "100%" }}>
                <Box
                  py={2}
                  sx={{
                    px: 3,
                    ...styles.centerV,
                    flexDirection: { xs: "column" },
                  }}
                >
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
                          xs: "1rem",
                          sm: "1.1rem",
                          md: "1.3rem",
                          fontFamily: "Roboto",
                        },
                        marginBottom: "6px",
                        fontWeight: "bold",
                        textDecoration: "none",
                        height: "100%",
                        display: {
                          xs: "block",
                          sm: "block",
                          md: "flex",
                          lg: "flex",
                        },
                        alignItems: "center",
                        alignSelf: "stretch",
                      }}
                    >
                      <Trans i18nKey="theAssessmentKitUsedInThisAssessmentIs" />{" "}
                      <Box
                        component={Link}
                        to={`/assessment-kits/${assessmentKit?.id}`}
                        sx={{
                          color: (t) => t.palette.primary.dark,
                          textDecoration: "none",
                          ml: 0.5,
                        }}
                      >
                        {assessmentKit?.title}
                      </Box>
                    </Typography>
                    <Typography color="GrayText" variant="body2">
                      {assessmentKit?.summary}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      ml: "auto",
                      // mr: 2,
                      textDecoration: "none",
                    }}
                    component={Link}
                    to={`/user/expert-groups/${expertGroup?.id}`}
                  >
                    <Typography
                      color="grayText"
                      variant="subLarge"
                      sx={{ fontSize: { xs: "0.6rem", md: "0.8rem" } }}
                    >
                      <Trans i18nKey="providedBy" />
                    </Typography>
                    <CardHeader
                      sx={{ p: 0, ml: 1.8 }}
                      titleTypographyProps={{
                        sx: { textDecoration: "none" },
                      }}
                      avatar={
                        <Avatar
                          sx={{
                            width: { xs: 30, sm: 40 },
                            height: { xs: 30, sm: 40 },
                          }}
                          alt={expertGroup?.title}
                          src={expertGroup?.picture || "/"}
                        />
                      }
                      title={
                        <Box
                          component={"b"}
                          sx={{ fontSize: { xs: "0.6rem", md: "0.95rem" } }}
                          color="Gray"
                        >
                          {expertGroup?.title}
                        </Box>
                      }
                    />
                  </Box>
                </Box>
              </Paper>
            </Box> */}
            <Grid container spacing={3} columns={12} mt={0.2}>
              <Grid item lg={5} md={14} sm={14} xs={14}>
                <AssessmentOverallStatus
                  status={status}
                  subjects_info={subjects}
                  maturity_level={maturityLevel}
                  maturity_level_count={assessmentKit?.maturityLevelCount}
                  confidence_value={confidenceValue}
                />
              </Grid>
              <Grid item lg={7} md={14} sm={14} xs={14}>
                <AssessmentOverallStatus
                  status={status}
                  subjects_info={subjects}
                  maturity_level={maturityLevel}
                  maturity_level_count={assessmentKit?.maturityLevelCount}
                  confidence_value={confidenceValue}
                />
              </Grid>
              <Grid item sm={14} xs={14} id="subjects">
                <AssessmentSubjectList
                  subjects={subjects}
                  colorCode={colorCode}
                />
              </Grid>
              <Grid item sm={14} xs={14} id="advices">
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
