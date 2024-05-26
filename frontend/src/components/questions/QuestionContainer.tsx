import React, { useRef } from "react";
import Checkbox from "@mui/material/Checkbox";
import Collapse from "@mui/material/Collapse";
import FormControlLabel from "@mui/material/FormControlLabel";
import Hidden from "@mui/material/Hidden";
import Box from "@mui/material/Box";
import {
  EAssessmentStatus,
  questionActions,
  useQuestionContext,
  useQuestionDispatch,
} from "@providers/QuestionProvider";
import { QuestionCard } from "./QuestionCard";
import { Trans } from "react-i18next";
import ErrorEmptyData from "@common/errors/ErrorEmptyData";
import { Review } from "./QuestionsReview";
import { TransitionGroup } from "react-transition-group";
import useScreenResize from "@utils/useScreenResize";
import { styles } from "@styles";
import QuestionNextPrev from "./QuestionNextPrev";
import { QuestionsProgress } from "./QuestionsProgress";
import { ErrorNotFoundOrAccessDenied } from "@common/errors/ErrorNotFoundOrAccessDenied";

export const QuestionContainer = () => {
  const {
    hasAnyQuestion,
    questionInfo,
    hasNextQuestion,
    hasPreviousQuestion,
    container,
    assessmentStatus,
    questionsInfo,
    loaded,
    questionIndex,
  } = useQuestion();
  return loaded ? (
    hasAnyQuestion ? (
      <Box minWidth="100vw" overflow="hidden">
        {questionsInfo.questions?.[questionIndex - 1] && (
          <QuestionsProgress
            hasNextQuestion={hasNextQuestion}
            hasPreviousQuestion={hasPreviousQuestion}
          />
        )}
        {assessmentStatus === EAssessmentStatus.DONE ? (
          <Review questions={questionsInfo.questions} />
        ) : (
          <Box
            position="relative"
            sx={{ ...styles.centerVH, px: { xs: 0, sm: 5, md: 6 } }}
          >
            {questionsInfo.questions?.[questionIndex - 1] ? (
              <Box>
                <Box
                  display="flex"
                  flexDirection={"column"}
                  flex="1"
                  py={2}
                  sx={{ pt: { xs: 0, sm: 2 } }}
                  ref={container}
                  maxWidth={"1376px"}
                >
                  <TransitionGroup>
                    <Collapse
                      key={
                        questionsInfo.questions[questionIndex - 1].index as any
                      }
                    >
                      <QuestionCard
                        questionsInfo={questionsInfo}
                        questionInfo={questionInfo}
                        key={questionsInfo.questions[questionIndex - 1].index}
                      />
                    </Collapse>
                  </TransitionGroup>
                </Box>
              </Box>
            ) : (
              <Box mt={6}>
                <ErrorNotFoundOrAccessDenied />
              </Box>
            )}
          </Box>
        )}
      </Box>
    ) : (
      <ErrorEmptyData />
    )
  ) : null;
};

export const SubmitOnSelectCheckBox = () => {
  const { submitOnAnswerSelection } = useQuestionContext();
  const dispatch = useQuestionDispatch();
  const isSmallerScreen = useScreenResize("sm");

  return (
    <FormControlLabel
      sx={{ mr: 0, color: "#fff" }}
      data-cy="automatic-submit-check"
      control={
        <Checkbox
          checked={submitOnAnswerSelection}
          sx={{
            color: "#fff",
            "&.Mui-checked": {
              color: "#fff",
            },
          }}
          onChange={(e) => {
            dispatch(
              questionActions.setSubmitOnAnswerSelection(
                e.target.checked || false
              )
            );
          }}
        />
      }
      label={
        <Trans
          i18nKey={
            isSmallerScreen
              ? "submitAnswerAutomatically"
              : "submitAnswerAutomaticallyAndGoToNextQuestion"
          }
        />
      }
    />
  );
};

const findQuestion = (
  questions: any[] = [],
  questionIndex: string | undefined | number
) => {
  return questionIndex
    ? questions.find((question) => question.index == Number(questionIndex))
    : undefined;
};

const useQuestion = () => {
  const { questionIndex, questionsInfo, assessmentStatus, isSubmitting } =
    useQuestionContext();
  const loaded = !!questionsInfo?.questions;
  const hasAnyQuestions = loaded
    ? (questionsInfo?.questions as any).length > 0
    : false;
  const hasAnyQuestion = loaded
    ? (questionsInfo?.questions as any).length > 0
    : false;
  const questionInfo = findQuestion(questionsInfo.questions, questionIndex);
  const hasNextQuestion =
    hasAnyQuestion && questionIndex < questionsInfo.total_number_of_questions;
  const hasPreviousQuestion = hasAnyQuestion && questionIndex > 1;
  const container = useRef(null);

  return {
    hasAnyQuestion,
    questionInfo,
    hasNextQuestion,
    hasPreviousQuestion,
    container,
    assessmentStatus,
    questionsInfo,
    questionIndex,
    isSubmitting,
    loaded,
  };
};
