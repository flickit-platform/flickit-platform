import { useEffect } from "react";
import Box from "@mui/material/Box";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import { QuestionnaireList } from "./QuestionnaireList";
import { Trans } from "react-i18next";
import { styles } from "@styles";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import { IQuestionnairesModel } from "@types";
import Title from "@common/Title";
import AlertTitle from "@mui/material/AlertTitle";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { LoadingSkeleton } from "@common/loadings/LoadingSkeleton";
import SupTitleBreadcrumb, {
  useSupTitleBreadcrumb,
} from "@common/SupTitleBreadcrumb";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import Button from "@mui/material/Button";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import PermissionControl from "@common/PermissionControl";
import AlertBox from "@common/AlertBox";
import setDocumentTitle from "@utils/setDocumentTitle";
import { t } from "i18next";
import QueryData from "../common/QueryData";
import { useConfigContext } from "@/providers/ConfgProvider";
const QuestionnaireContainer = () => {
  const { questionnaireQueryData, assessmentTotalProgress, fetchPathInfo } =
    useQuestionnaire();

  const progress =
    ((assessmentTotalProgress?.data?.answersCount || 0) /
      (assessmentTotalProgress?.data?.questionsCount || 1)) *
    100;

  return (
    <PermissionControl error={[questionnaireQueryData.errorObject]}>
      <Box>
        <QueryData
          {...fetchPathInfo}
          loading={false}
          render={(pathInfo = {}) => {
            return <QuestionnaireTitle pathInfo={pathInfo} />;
          }}
        />

        <NotCompletedAlert
          isCompleted={progress == 100}
          hasStatus={false}
          loading={questionnaireQueryData.loading}
        />
        <Box
          flexWrap={"wrap"}
          sx={{
            ...styles.centerCV,
            transition: "height 1s ease",
            backgroundColor: "#01221e",
            background: questionnaireQueryData.loading
              ? undefined
              : `linear-gradient(135deg, #2e7d72 ${progress}%, #01221e ${progress}%)`,
            px: { xs: 1, sm: 2, md: 3, lg: 4 },
            pt: { xs: 5, sm: 3 },
            pb: 5,
          }}
          borderRadius={2}
          my={2}
          color="white"
          position={"relative"}
        >
          <QuestionnaireList
            assessmentTotalProgress={assessmentTotalProgress}
            questionnaireQueryData={questionnaireQueryData}
          />
        </Box>
      </Box>
    </PermissionControl>
  );
};

const useQuestionnaire = () => {
  const { service } = useServiceContext();
  const [searchParams] = useSearchParams();
  const { assessmentId } = useParams();
  const subjectIdParam = searchParams.get("subject_pk");

  const questionnaireQueryData = useQuery<IQuestionnairesModel>({
    service: (args = { subject_pk: subjectIdParam }, config) =>
      service.fetchQuestionnaires({ assessmentId, ...(args || {}) }, config),
  });
  const assessmentTotalProgress = useQuery<IQuestionnairesModel>({
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
  return {
    questionnaireQueryData,
    assessmentTotalProgress,
    fetchPathInfo,
  };
};

const NotCompletedAlert = (props: {
  isCompleted: boolean;
  loading: boolean;
  hasStatus: boolean;
}) => {
  const { isCompleted, loading, hasStatus } = props;

  return (
    <Box mt={2}>
      {loading ? (
        <LoadingSkeleton height="76px" />
      ) : (
        <AlertBox
          severity={isCompleted ? "success" : "info"}
          action={
            <Button
              variant="contained"
              color="info"
              component={Link}
              to="./../insights"
              startIcon={<AnalyticsRoundedIcon />}
            >
              <Trans i18nKey="viewInsights" />
            </Button>
          }
        >
          <AlertTitle>
            {isCompleted ? (
              <Trans i18nKey={"YouHaveFinishedAllQuestionnaires"} />
            ) : hasStatus ? (
              <Trans i18nKey="toGetMoreAccurateInsights" />
            ) : (
              <Trans i18nKey="toAssessSystemNeedToAnswerQuestions" />
            )}
          </AlertTitle>
          {isCompleted ? (
            <Trans i18nKey={"ToChangeYourInsightTryEditingQuestionnaires"} />
          ) : (
            <Trans i18nKey="pickupQuestionnaire" />
          )}
        </AlertBox>
      )}
    </Box>
  );
};

const QuestionnaireTitle = (props: any) => {
  const { pathInfo } = props;
  const { spaceId, assessmentId, page } = useParams();
  const { space, assessment } = pathInfo;

  const { config } = useConfigContext();

  useEffect(() => {
    setDocumentTitle(
      `${assessment?.title} ${t("questionnaires")}`,
      config.appTitle
    );
  }, [assessment]);

  return (
    <Title
      backLink={-1}
      sup={
        <SupTitleBreadcrumb
          routes={[
            {
              title: space?.title,
              to: `/${spaceId}/assessments/${page}`,
              icon: <FolderRoundedIcon fontSize="inherit" sx={{ mr: 0.5 }} />,
            },
            {
              title: assessment?.title,
              icon: (
                <DescriptionRoundedIcon fontSize="inherit" sx={{ mr: 0.5 }} />
              ),
            },
          ]}
        />
      }
    >
      <QuizRoundedIcon sx={{ mr: 1 }} />
      <Trans i18nKey="Questionnaires" />
    </Title>
  );
};

export { QuestionnaireContainer };
