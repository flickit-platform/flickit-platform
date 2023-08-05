import React, { PropsWithChildren, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useNavigate, useParams } from "react-router-dom";
import { EAssessmentStatus, questionActions, useQuestionDispatch } from "@/providers/QuestionProvider";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import LoadingSkeletonOfQuestions from "@common/loadings/LoadingSkeletonOfQuestions";
import QuestionsTitle from "./QuestionsTitle";
import QueryBatchData from "@common/QueryBatchData";
import { IQuestionnaireModel, IQuestionsModel, TId } from "@types";

const QuestionsContainer = (props: PropsWithChildren<{ isReview?: boolean }>) => {
  const { questionIndex } = useParams();
  const dispatch = useQuestionDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!props.isReview && !questionIndex) {
      navigate("./1", { replace: true });
      return;
    }
    if (
      !props.isReview &&
      questionIndex !== "completed" &&
      (isNaN(Number(questionIndex)) || Number(questionIndex) === 0 || Number(questionIndex) < 0)
    ) {
      navigate("./1", { replace: true });
      return;
    }

    if (questionIndex == "completed") {
      dispatch(questionActions.setAssessmentStatus(EAssessmentStatus.DONE));
      return;
    }
    dispatch(questionActions.setAssessmentStatus(EAssessmentStatus.INPROGRESS));
    dispatch(questionActions.goToQuestion(questionIndex));
  }, [questionIndex]);

  return (
    <>
      <QuestionsContainerC {...props} />
    </>
  );
};

export const QuestionsContainerC = (props: PropsWithChildren<{ isReview?: boolean }>) => {
  const { children, isReview = false } = props;
  const { questionsResultQueryData, questionnaireQueryData } = useQuestions();

  return (
    <QueryBatchData<IQuestionsModel | IQuestionnaireModel>
      queryBatchData={[questionsResultQueryData, questionnaireQueryData]}
      loaded={questionnaireQueryData.loaded}
      renderLoading={() => <LoadingSkeletonOfQuestions />}
      render={([_, questionnaireData]) => {
        return (
          <>
            <Box py={1}>
              <QuestionsTitle data={questionnaireData as IQuestionnaireModel} isReview={isReview} />
            </Box>
            <Box display="flex" justifyContent="center">
              {children}
            </Box>
          </>
        );
      }}
    />
  );
};

const useQuestions = () => {
  const { service } = useServiceContext();
  const [resultId, setResultId] = useState<TId | undefined>(undefined);
  const dispatch = useQuestionDispatch();
  const { questionIndex, questionnaireId = "", assessmentId = "" } = useParams();
  const questionnaireQueryData = useQuery<IQuestionnaireModel>({
    service: (args, config) => service.fetchQuestionnaire({ questionnaireId }, config),
  });
  const questionsResultQueryData = useQuery<IQuestionsModel>({
    service: (args, config) => service.fetchQuestionsResult({ questionnaireId, assessmentId }, config),
  });

  useEffect(() => {
    if (questionsResultQueryData.loaded) {
      const { questions = [], assessment_result_id } = questionsResultQueryData.data;

      dispatch(
        questionActions.setQuestionsInfo({
          total_number_of_questions: questions.length,
          resultId: assessment_result_id,
          questions,
        })
      );
    }
  }, [questionsResultQueryData.loading]);

  return {
    questionsResultQueryData,
    questionnaireQueryData,
  };
};

export default QuestionsContainer;
