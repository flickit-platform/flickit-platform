import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import { QuestionnaireList } from "./QuestionnaireList";
import { Trans } from "react-i18next";
import { styles } from "../../config/styles";
import { useQuery } from "../../utils/useQuery";
import { useServiceContext } from "../../providers/ServiceProvider";
import { IQuestionnairesModel } from "../../types";
import Title from "../shared/Title";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { usePreviousProps } from "@mui/utils";

const QuestionnaireContainer = () => {
  const {
    progress,
    isCompleted,
    questionnaireQueryData,
    total_metric_number,
    total_answered_metric,
    loading,
  } = useQuestionnaire();
  const { state } = useLocation();

  return (
    <Box>
      <Title
        backLink={state?.pathname || -1}
        sup={
          <>
            <Trans i18nKey="assessment" />
          </>
        }
      >
        <QuizRoundedIcon sx={{ mr: 1 }} />
        <Trans i18nKey="Questionnaires" />
      </Title>

      <NotCompletedAlert isCompleted={isCompleted} />
      <Box
        flexWrap={"wrap"}
        sx={{
          ...styles.centerCV,
          backgroundColor: "#2e7d72",
          background: `linear-gradient(135deg, #2e7d72 ${progress}%, #01221e ${progress}%)`,
          px: { xs: 1, sm: 2, md: 3, lg: 4 },
          py: { xs: 5, sm: 3 },
        }}
        borderRadius={2}
        my={2}
        color="white"
        position={"relative"}
      >
        <QuestionnaireList questionnaireQueryData={questionnaireQueryData} />
      </Box>
    </Box>
  );
};

const useQuestionnaire = () => {
  const { service } = useServiceContext();
  const [searchParams] = useSearchParams();
  const { assessmentId } = useParams();
  const subjectIdParam = searchParams.get("subjectId");

  const questionnaireQueryData = useQuery<IQuestionnairesModel>({
    service: (args = { subjectId: subjectIdParam }, config) =>
      service.fetchQuestionnaires({ assessmentId, ...(args || {}) }, config),
  });

  const { data, loading = true, loaded } = questionnaireQueryData;
  const {
    total_metric_number = 0,
    total_answered_metric = 0,
    progress = 0,
  } = (data as any) || {};

  const isCompleted = progress === 100;

  return {
    progress,
    isCompleted,
    questionnaireQueryData,
    total_metric_number,
    total_answered_metric,
    loading,
  };
};

const NotCompletedAlert = (props: { isCompleted: boolean }) => {
  const { isCompleted } = props;
  const [open, setOpen] = useState(!isCompleted);

  return (
    <Collapse in={open}>
      <Box mt={2}>
        <Alert
          severity="info"
          action={
            <IconButton
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
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
      </Box>
    </Collapse>
  );
};

export { QuestionnaireContainer };
