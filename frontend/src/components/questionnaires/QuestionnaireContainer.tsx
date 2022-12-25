import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/material";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import { QuestionnaireList } from "./QuestionnaireList";
import { Trans } from "react-i18next";
import { styles } from "../../config/styles";
import { useQuery } from "../../utils/useQuery";
import { useServiceContext } from "../../providers/ServiceProvider";
import {
  IAssessmentReportModel,
  IQuestionnairesModel,
  IQuestionnairesPageDataModel,
  ITotalProgressModel,
  TQueryProps,
} from "../../types";
import Title from "../shared/Title";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import { LoadingSkeleton } from "../shared/loadings/LoadingSkeleton";
import SupTitleBreadcrumb, {
  useSupTitleBreadcrumb,
} from "../shared/SupTitleBreadcrumb";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import hasStatus from "../../utils/hasStatus";
import Button from "@mui/material/Button";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import PermissionControl from "../shared/PermissionControl";
import AlertBox from "../shared/AlertBox";

const QuestionnaireContainer = () => {
  const {
    pageQueryData,
    questionnaireQueryData,
    totalProgressQueryData,
    assessmentQueryData,
  } = useQuestionnaire();
  const progress = questionnaireQueryData.data?.progress || 0;

  return (
    <PermissionControl
      error={[
        pageQueryData.errorObject,
        questionnaireQueryData.errorObject,
        totalProgressQueryData.errorObject,
        assessmentQueryData.errorObject,
      ]}
    >
      <Box>
        <QuestionnaireTitle />
        <NotCompletedAlert
          isCompleted={
            totalProgressQueryData.data?.total_progress?.progress == 100
          }
          hasStatus={hasStatus(assessmentQueryData.data?.status)}
          loading={
            totalProgressQueryData.loading || assessmentQueryData.loading
          }
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
            questionnaireQueryData={questionnaireQueryData}
            pageQueryData={pageQueryData}
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

  const pageQueryData = useQuery<IQuestionnairesPageDataModel>({
    service: (args = { assessmentId }, config) =>
      service.fetchQuestionnairesPageData(args, config),
  });

  const totalProgressQueryData = useQuery<ITotalProgressModel>({
    service: (args = { assessmentId }, config) =>
      service.fetchTotalProgress(args, config),
  });

  const assessmentQueryData = useQuery<IAssessmentReportModel>({
    service: (args = { assessmentId }, config) =>
      service.fetchAssessment(args, config),
  });

  return {
    pageQueryData,
    questionnaireQueryData,
    totalProgressQueryData,
    assessmentQueryData,
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
              disabled={!hasStatus}
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

const QuestionnaireTitle = () => {
  const { spaceId, assessmentId } = useParams();
  const breadcrumbInfo = useSupTitleBreadcrumb({
    spaceId,
    assessmentId,
  });

  return (
    <Title
      backLink={-1}
      sup={
        <SupTitleBreadcrumb
          routes={[
            {
              title: breadcrumbInfo.space,
              to: `/${spaceId}/assessments`,
              icon: <FolderRoundedIcon fontSize="inherit" sx={{ mr: 0.5 }} />,
            },
            {
              title: breadcrumbInfo.assessment,
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
