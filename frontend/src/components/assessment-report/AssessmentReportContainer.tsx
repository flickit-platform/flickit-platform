import { useEffect } from "react";
import { Box, Divider, IconButton, Tooltip, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import QueryBatchData from "@common/QueryBatchData";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@utils/useQuery";
import { AssessmentSubjectList } from "./AssessmentSubjectList";
import { useServiceContext } from "@providers/ServiceProvider";
import { AssessmentOverallStatus } from "./AssessmentOverallStatus";
import LoadingSkeletonOfAssessmentReport from "@common/loadings/LoadingSkeletonOfAssessmentReport";
import AssessmentReportTitle from "./AssessmentReportTitle";
import { IAssessmentReportModel, RolesType } from "@types";
import AssessmentAdviceContainer from "./AssessmentAdviceContainer";
import { AssessmentSummary } from "./AssessmentSummary";
import { AssessmentSubjectStatus } from "./AssessmentSubjectStatus";
import { AssessmentReportKit } from "./AssessmentReportKit";
import { Trans } from "react-i18next";
import { styles } from "@styles";
import MoreActions from "@common/MoreActions";
import SettingsIcon from "@mui/icons-material/Settings";
import useMenu from "@/utils/useMenu";
import { ArticleRounded } from "@mui/icons-material";
import { AssessmentInsight } from "./AssessmentInsight";
import { secondaryFontFamily } from "@/config/theme";
import BetaSvg from "@assets/svg/beta.svg";

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
  const { spaceId } = useParams();
  const fetchAssessmentsRoles = useQuery<RolesType>({
    service: (args, config) => service.fetchAssessmentsRoles(args, config),
    toastError: false,
    toastErrorOptions: { filterByStatus: [404] },
  });
  return (
    <QueryBatchData
      queryBatchData={[
        queryData,
        assessmentTotalProgress,
        fetchAssessmentsRoles,
      ]}
      renderLoading={() => <LoadingSkeletonOfAssessmentReport />}
      render={([data = {}, progress, roles]) => {
        const {
          status,
          assessment,
          subjects,
          topStrengths,
          topWeaknesses,
          assessmentPermissions: { manageable, exportable },
        } = data || {};
        const colorCode = assessment?.color?.code || "#101c32";
        const { assessmentKit, maturityLevel, confidenceValue } =
          assessment || {};
        const { expertGroup } = assessmentKit || {};
        const { questionsCount, answersCount } = progress;

        const totalProgress =
          ((answersCount || 0) / (questionsCount || 1)) * 100;
        const totalAttributesLength = subjects.reduce(
          (sum: any, subject: any) => {
            return sum + (subject.attributes?.length || 0);
          },
          0
        );

        return (
          <Box m="auto" pb={3} sx={{ px: { xl: 30, lg: 18, xs: 2, sm: 3 } }}>
            <AssessmentReportTitle data={data} colorCode={colorCode} />
            <Grid container spacing={1} columns={12} mt={0}>
              <Grid item sm={12} xs={12}>
                <Box display="flex" justifyContent="space-between">
                  <Typography
                    color="primary"
                    textAlign="left"
                    variant="headlineLarge"
                  >
                    <Trans i18nKey="assessmentInsights" />
                  </Typography>
                  <Box sx={{ py: "0.6rem", display: "flex" }}>
                    <Tooltip title={<Trans i18nKey={"assessmentDocument"} />}>
                      <Box>
                        <IconButton
                          data-cy="more-action-btn"
                          disabled={!exportable}
                          component={exportable ? Link : "div"}
                          to={`/${spaceId}/assessments/1/${assessmentId}/assessment-document/`}
                        >
                          <ArticleRounded
                            sx={{ fontSize: "1.5rem", margin: "0.2rem" }}
                          />
                        </IconButton>
                      </Box>
                    </Tooltip>
                    <Tooltip title={<Trans i18nKey={"assessmentSettings"} />}>
                      <Box>
                        <IconButton
                          data-cy="more-action-btn"
                          disabled={!manageable}
                          component={manageable ? Link : "div"}
                          to={`/${spaceId}/assessments/1/${assessmentId}/assessment-settings/`}
                        >
                          <SettingsIcon
                            sx={{ fontSize: "1.5rem", margin: "0.2rem" }}
                          />
                        </IconButton>
                      </Box>
                    </Tooltip>
                  </Box>
                </Box>
                <Grid container alignItems="stretch" spacing={2} mt={1}>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      gap={1}
                      height="100%"
                    >
                      <Typography
                        color="#73808C"
                        marginX={4}
                        variant="titleMedium"
                        fontFamily={secondaryFontFamily}
                      >
                        <Trans i18nKey="general" />
                      </Typography>
                      <AssessmentSummary
                        expertGroup={expertGroup}
                        assessmentKit={assessment}
                        data={data}
                        progress={totalProgress}
                        questionCount={questionsCount}
                        answerCount={answersCount}
                      />
                    </Box>
                  </Grid>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      gap={1}
                      height="100%"
                    >
                      <Typography
                        color="#73808C"
                        marginX={4}
                        variant="titleMedium"
                        fontFamily={secondaryFontFamily}
                      >
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
                      <Typography color="#73808C" marginX={4}>
                        <Trans i18nKey="subjectStatus" />
                      </Typography>
                      <AssessmentSubjectStatus subjects={subjects} />
                    </Box>
                  </Grid> */}
                </Grid>
              </Grid>

              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Box display="flex" flexDirection="column" gap={1}>
                  <Typography
                    color="#73808C"
                    marginX={4}
                    variant="titleMedium"
                    fontFamily={secondaryFontFamily}
                  >
                    <Trans i18nKey="insight" />
                  </Typography>
                  <AssessmentInsight />
                </Box>
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Box display="flex" flexDirection="column" gap={1}>
                  <Typography
                    color="#73808C"
                    marginX={4}
                    variant="titleMedium"
                    fontFamily={secondaryFontFamily}
                  >
                    <Trans i18nKey="assessmentKit" />
                  </Typography>
                  <AssessmentReportKit assessmentKit={assessmentKit} />
                </Box>
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Box
                  sx={{ ...styles.centerCV }}
                  alignItems="flex-start"
                  marginTop={6}
                >
                  <Typography color="#73808C" variant="h5">
                    <Trans i18nKey="subjectReport" />
                  </Typography>
                  <Typography variant="titleMedium" fontWeight={400}>
                    <Trans
                      i18nKey="overallStatusDetails"
                      values={{
                        attributes: totalAttributesLength,
                        subjects: subjects?.length,
                      }}
                    />
                  </Typography>
                  <Divider sx={{ width: "100%", marginTop: 2 }} />
                </Box>
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12} id="subjects">
                <AssessmentSubjectList
                  maturityLevelCount={assessmentKit?.maturityLevelCount ?? 5}
                  subjects={subjects}
                  colorCode={colorCode}
                />
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Box sx={{ ...styles.centerCV }} marginTop={6} gap={2}>
                  <Typography
                    color="#73808C"
                    variant="h5"
                    display="flex"
                    alignItems="center"
                  >
                    <Trans i18nKey="adviceGenerator" />
                    <Box sx={{ ml: 1, mt: 1 }}>
                      <img src={BetaSvg} alt="beta" width={34} />
                    </Box>
                  </Typography>

                  <Divider sx={{ width: "100%" }} />
                </Box>
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12} id="advices">
                <AssessmentAdviceContainer
                  subjects={subjects}
                  assessment={assessment}
                />
              </Grid>
            </Grid>
          </Box>
        );
      }}
    />
  );
};

const Actions = (props: { assessmentId: string; manageable: boolean }) => {
  const { assessmentId, manageable } = props;
  const navigate = useNavigate();
  const { spaceId } = useParams();

  const assessmentSetting = (e: any) => {
    navigate({
      pathname: `/${spaceId}/assessments/1/${assessmentId}/assessment-settings/`,
    });
  };
  return (
    <MoreActions
      {...useMenu()}
      boxProps={{ py: "0.6rem" }}
      fontSize="large"
      items={[
        manageable && {
          icon: <SettingsIcon style={{ fontSize: "2rem" }} fontSize="large" />,
          text: <Trans i18nKey="settings" />,
          onClick: assessmentSetting,
        },
      ]}
    />
  );
};

export default AssessmentReportContainer;
