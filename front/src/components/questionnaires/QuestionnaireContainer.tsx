import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import { QuestionnaireList } from "./QuestionnaireList";
import { Trans } from "react-i18next";
import { styles } from "../../config/styles";
import { useQuery } from "../../utils/useQuery";
import { useServiceContext } from "../../providers/ServiceProvider";
import {
  IQuestionnairesModel,
  IQuestionnairesPageDataModel,
  ITotalProgressModel,
} from "../../types";
import Title from "../shared/Title";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import { LoadingSkeleton } from "../shared/loadings/LoadingSkeleton";

const QuestionnaireContainer = () => {
  const { pageQueryData, questionnaireQueryData, totalProgressQueryData } =
    useQuestionnaire();
  const progress = questionnaireQueryData.data?.progress || 0;
  const loaded = useRef(false);

  useEffect(() => {
    if (questionnaireQueryData.loaded) {
      loaded.current = true;
    }
  }, [questionnaireQueryData.loading]);

  return (
    <Box>
      <Title
        backLink={-1}
        sup={
          <Box display="flex" alignItems={"center"}>
            {pageQueryData.loading ? (
              <Skeleton width="80px" height="22px" sx={{ mr: 1 }} />
            ) : (
              pageQueryData.data.assessment_title
            )}{" "}
            <Trans i18nKey="assessment" />
          </Box>
        }
      >
        <QuizRoundedIcon sx={{ mr: 1 }} />
        <Trans i18nKey="Questionnaires" />
      </Title>

      <NotCompletedAlert
        isCompleted={
          totalProgressQueryData.data?.total_progress?.progress == 100
        }
        loading={totalProgressQueryData.loading}
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

  return {
    pageQueryData,
    questionnaireQueryData,
    totalProgressQueryData,
  };
};

const NotCompletedAlert = (props: {
  isCompleted: boolean;
  loading: boolean;
}) => {
  const { isCompleted, loading } = props;

  return (
    <Box mt={2}>
      {loading ? (
        <LoadingSkeleton height="76px" />
      ) : (
        <Alert severity={isCompleted ? "success" : "info"}>
          <AlertTitle>
            {isCompleted ? (
              <Trans i18nKey={"YouHaveFinishedAllQuestionnaires"} />
            ) : (
              <Trans i18nKey="toAssessSystemNeedToAnswerQuestions" />
            )}
          </AlertTitle>
          {isCompleted ? (
            <Trans i18nKey={"ToChangeYourInsightTryEditingQuestionnaires"} />
          ) : (
            <Trans i18nKey="pickupQuestionnaire" />
          )}
        </Alert>
      )}
    </Box>
  );
};

export { QuestionnaireContainer };
