import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import { QuestionnaireList } from "./QuestionnaireList";
import { Trans } from "react-i18next";
import { styles } from "../../config/styles";
import { useQuery } from "../../utils/useQuery";
import { useServiceContext } from "../../providers/ServiceProvider";
import { IQuestionnairesModel, ITotalProgressModel } from "../../types";
import Title from "../shared/Title";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";

const QuestionnaireContainer = () => {
  const { totalProgressQueryData, questionnaireQueryData } = useQuestionnaire();

  const { state } = useLocation();
  const progress = totalProgressQueryData.data?.total_progress?.progress || 0;

  return (
    <Box>
      <Title
        backLink={-1}
        sup={
          <Box display="flex" alignItems={"center"}>
            {totalProgressQueryData.loading ? (
              <Skeleton width="80px" height="22px" sx={{ mr: 1 }} />
            ) : (
              totalProgressQueryData.data.assessment_project_title
            )}{" "}
            <Trans i18nKey="assessment" />
          </Box>
        }
      >
        <QuizRoundedIcon sx={{ mr: 1 }} />
        <Trans i18nKey="Questionnaires" />
      </Title>

      {totalProgressQueryData.loaded && (
        <NotCompletedAlert isCompleted={progress == 100} />
      )}
      <Box
        flexWrap={"wrap"}
        sx={{
          ...styles.centerCV,
          backgroundColor: "#2e7d72",
          background: `linear-gradient(135deg, #2e7d72 ${progress}%, #01221e ${progress}%)`,
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
          totalProgressQueryData={totalProgressQueryData}
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

  const totalProgressQueryData = useQuery<ITotalProgressModel>({
    service: (args = { assessmentId }, config) =>
      service.fetchTotalProgress(args, config),
  });

  return {
    totalProgressQueryData,
    questionnaireQueryData,
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
