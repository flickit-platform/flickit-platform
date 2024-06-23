import { useEffect } from "react";
import Hidden from "@mui/material/Hidden";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import GettingThingsReadyLoading from "@common/loadings/GettingThingsReadyLoading";
import Title from "@common/Title";
import { styles } from "@styles";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import { SubjectAttributeList } from "./SubjectAttributeList";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import SubjectRadarChart from "./SubjectRadarChart";
import SubjectBarChart from "./SubjectBarChart";
import SubjectOverallInsight from "./SubjectOverallInsight";
import { ISubjectReportModel } from "@types";
import hasStatus from "@utils/hasStatus";
import QuestionnairesNotCompleteAlert from "../questionnaires/QuestionnairesNotCompleteAlert";
import Button from "@mui/material/Button";
import SupTitleBreadcrumb, {
  useSupTitleBreadcrumb,
} from "@common/SupTitleBreadcrumb";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import { t } from "i18next";
import setDocumentTitle from "@utils/setDocumentTitle";
import QueryBatchData from "@common/QueryBatchData";
import toastError from "@/utils/toastError";
import { ICustomError } from "@/utils/CustomError";
import { useConfigContext } from "@/providers/ConfgProvider";

const SubjectContainer = () => {
  const {
    loading,
    loaded,
    hasError,
    subjectQueryData,
    subjectId,
    subjectProgressQueryData,
    fetchPathInfo,
  } = useSubject();

  return (
    <QueryBatchData
      queryBatchData={[
        subjectQueryData,
        subjectProgressQueryData,
        fetchPathInfo,
      ]}
      error={hasError}
      loading={loading}
      loaded={loaded}
      render={([data = {}, subjectProgress = {}, pathInfo = {}]) => {
        const {
          attributes,
          subject,
          topStrengths,
          topWeaknesses,
          maturityLevelsCount,
        } = data;
        const { isConfidenceValid, isCalculateValid, title } = subject;
        const { question_count, answers_count } = subjectProgress;
        const isComplete = question_count === answers_count;
        const progress = ((answers_count || 0) / (question_count || 1)) * 100;

        const attributesNumber = attributes.length;
        return (
          <Box>
            <SubjectTitle
              {...subjectQueryData}
              loading={loading}
              pathInfo={pathInfo}
            />
            {!isComplete && loaded && (
              <Box mt={2} mb={1}>
                <QuestionnairesNotCompleteAlert
                  subjectName={subject?.title}
                  to={`./../../questionnaires?subject_pk=${subjectId}`}
                  q={question_count}
                  a={answers_count}
                  progress={progress}
                />
              </Box>
            )}
            {loading ? (
              <Box sx={{ ...styles.centerVH }} py={6} mt={5}>
                <GettingThingsReadyLoading color="gray" />
              </Box>
            ) : !loaded ? null : !isCalculateValid || !isConfidenceValid ? (
              <NoInsightYetMessage
                title={title}
                no_insight_yet_message={!isCalculateValid || !isConfidenceValid}
              />
            ) : (
              <Box sx={{ px: 0.5 }}>
                <Box
                  mt={3}
                  sx={{
                    background: "white",
                    borderRadius: 2,
                    py: 4,
                    px: { xs: 1, sm: 2, md: 3 },
                  }}
                >
                  <Box>
                    <SubjectOverallInsight
                      {...subjectQueryData}
                      loading={loading}
                    />
                  </Box>
                  <Hidden smDown>
                    {attributesNumber > 2 && (
                      <Box height={"620px"} mb={10} mt={10}>
                        <Typography>
                          <Trans
                            i18nKey="inTheRadarChartBelow"
                            values={{
                              title: title || "",
                            }}
                          />
                        </Typography>

                        <SubjectRadarChart
                          {...subjectQueryData}
                          loading={loading}
                        />
                      </Box>
                    )}
                    <Box height={"520px"} mt={10}>
                      <SubjectBarChart
                        {...subjectQueryData}
                        loading={loading}
                      />
                    </Box>
                  </Hidden>
                </Box>
                <Box>
                  <SubjectAttributeList
                    {...subjectQueryData}
                    loading={loading}
                  />
                </Box>
              </Box>
            )}
          </Box>
        );
      }}
    />
  );
};

const useSubject = () => {
  const { service } = useServiceContext();
  const { subjectId = "", assessmentId } = useParams();
  const subjectQueryData = useQuery<ISubjectReportModel>({
    service: (args: { subjectId: string; assessmentId: string }, config) =>
      service.fetchSubject(args, config),
    runOnMount: false,
  });
  const subjectProgressQueryData = useQuery<any>({
    service: (args: { subjectId: string; assessmentId: string }, config) =>
      service.fetchSubjectProgress(args, config),
    runOnMount: false,
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
  const fetchPathInfo = useQuery({
    service: (args, config) =>
      service.fetchPathInfo({ assessmentId, ...(args || {}) }, config),
    runOnMount: true,
  });
  const calculate = async () => {
    try {
      await calculateMaturityLevelQuery.query();
      await subjectQueryData.query({ subjectId, assessmentId });
      await subjectProgressQueryData.query({ subjectId, assessmentId });
    } catch (e) {
      toastError(e as ICustomError);
    }
  };
  const calculateConfidence = async () => {
    try {
      await calculateConfidenceLevelQuery.query();
      await subjectQueryData.query({ subjectId, assessmentId });
      await subjectProgressQueryData.query({ subjectId, assessmentId });
    } catch (e) {}
  };
  useEffect(() => {
    if (
      subjectQueryData.errorObject?.response?.data?.code ==
      "CALCULATE_NOT_VALID"
    ) {
      calculate();
    }
    if (
      subjectQueryData.errorObject?.response?.data?.code ==
      "CONFIDENCE_CALCULATION_NOT_VALID"
    ) {
      calculateConfidence();
    }
  }, [subjectQueryData.errorObject]);
  useEffect(() => {
    subjectQueryData.query({ subjectId, assessmentId });
    subjectProgressQueryData.query({ subjectId, assessmentId });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const hasError = subjectQueryData.error || subjectProgressQueryData.error;

  const loading = subjectQueryData.loading || subjectProgressQueryData.loading;
  const loaded = subjectQueryData.loaded || subjectProgressQueryData.loaded;

  const noStatus = !hasStatus(subjectQueryData.data?.status);

  return {
    noStatus,
    loading,
    loaded,
    hasError,
    subjectId,
    subjectQueryData,
    subjectProgressQueryData,
    fetchPathInfo,
  };
};

const SubjectTitle = (props: {
  data: ISubjectReportModel;
  loading: boolean;
  pathInfo: any;
}) => {
  const { data, loading, pathInfo } = props;
  const { subject } = data || {};
  const { title } = subject;
  const { spaceId, assessmentId, page } = useParams();
  const { space, assessment } = pathInfo;
  const { config } = useConfigContext();

  useEffect(() => {
    setDocumentTitle(`${title} ${t("insight")}`, config.appTitle);
  }, [title]);
  return (
    <Title
      letterSpacing=".08em"
      sx={{ opacity: 0.9 }}
      backLink={-1}
      id="insight"
      inPageLink="insight"
      sup={
        <SupTitleBreadcrumb
          routes={[
            {
              title: space?.title,
              to: `/${spaceId}/assessments/${page}`,
              icon: <FolderRoundedIcon fontSize="inherit" sx={{ mr: 0.5 }} />,
            },
            {
              title: `${assessment?.title} ${t("insights")}`,
              to: `/${spaceId}/assessments/${page}/${assessmentId}/insights`,
              icon: (
                <DescriptionRoundedIcon fontSize="inherit" sx={{ mr: 0.5 }} />
              ),
            },
            {
              title: <>{title || <Trans i18nKey="technicalDueDiligence" />}</>,
              icon: (
                <AnalyticsRoundedIcon fontSize="inherit" sx={{ mr: 0.5 }} />
              ),
            },
          ]}
        />
      }
    >
      <Box sx={{ ...styles.centerV }}>
        <QueryStatsRoundedIcon
          sx={{
            mr: 1,
            color: "rgba(0, 0, 0, 0.87)",
          }}
        />
        {loading ? (
          <Skeleton width={"84px"} sx={{ mr: 0.5, display: "inline-block" }} />
        ) : (
          title || ""
        )}{" "}
        <Trans i18nKey="insights" />
      </Box>
    </Title>
  );
};

const NoInsightYetMessage = (props: {
  title: string;
  no_insight_yet_message: boolean;
}) => {
  const { subjectId } = useParams();
  const { title, no_insight_yet_message } = props;
  return (
    <Box mt={2}>
      <Paper
        sx={{
          ...styles.centerCVH,
          background: "gray",
          color: "white",
          p: 3,
          py: 8,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        {no_insight_yet_message ? (
          <Typography variant="h4" fontFamily={"Roboto"}>
            {no_insight_yet_message}
          </Typography>
        ) : (
          <>
            <Typography variant="h4" fontFamily={"Roboto"}>
              <Trans i18nKey="moreQuestionsNeedToBeAnswered" />
            </Typography>
            <Typography
              variant="h5"
              fontFamily={"Roboto"}
              fontWeight="300"
              sx={{ mt: 2 }}
            >
              <Trans i18nKey="completeSomeOfQuestionnaires" />
            </Typography>
          </>
        )}
        <Button
          sx={{ mt: 3 }}
          variant="contained"
          component={Link}
          to={`./../../questionnaires?subject_pk=${subjectId}`}
        >
          {title} <Trans i18nKey="questionnaires" />
        </Button>
      </Paper>
    </Box>
  );
};

export default SubjectContainer;
