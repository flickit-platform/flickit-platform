import React, { PropsWithChildren, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useNavigate, useParams } from "react-router-dom";
import {
  EAssessmentStatus,
  questionActions,
  useQuestionDispatch,
  useQuestionContext,
} from "@/providers/QuestionProvider";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import LoadingSkeletonOfQuestions from "@common/loadings/LoadingSkeletonOfQuestions";
import QuestionsTitle from "./QuestionsTitle";
import QueryBatchData from "@common/QueryBatchData";
import { IQuestionnaireModel, IQuestionsModel, TId } from "@types";

const QuestionsContainer = (
  props: PropsWithChildren<{ isReview?: boolean }>
) => {
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
      (isNaN(Number(questionIndex)) ||
        Number(questionIndex) === 0 ||
        Number(questionIndex) < 0)
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
    <Box>
      <QuestionsContainerC {...props} />
    </Box>
  );
};

export const QuestionsContainerC = (
  props: PropsWithChildren<{ isReview?: boolean }>
) => {
  const { children, isReview = false } = props;
  const { questionsResultQueryData, fetchPathInfo } = useQuestions();

  return (
    <QueryBatchData<IQuestionsModel | IQuestionnaireModel>
      queryBatchData={[questionsResultQueryData, fetchPathInfo]}
      loaded={questionsResultQueryData.loaded}
      renderLoading={() => <LoadingSkeletonOfQuestions />}
      render={([questionnaireData, pathInfo = {}]) => {
        return (
          <Box>
            <Box py={1}>
              <QuestionsTitle
                data={questionnaireData as IQuestionnaireModel}
                isReview={isReview}
                pathInfo={pathInfo}
              />
            </Box>
            <Box display="flex" justifyContent="center">
              {children}
            </Box>
          </Box>
        );
      }}
    />
  );
};

const useQuestions = () => {
  const { service } = useServiceContext();
  const [resultId, setResultId] = useState<TId | undefined>(undefined);
  const dispatch = useQuestionDispatch();
  const { assessmentStatus } = useQuestionContext();
  const { questionnaireId = "", assessmentId = "" } = useParams();
  // const questionnaireQueryData = useQuery<IQuestionnaireModel>({
  //   service: (args, config) =>
  //     service.fetchQuestionnaire({ questionnaireId }, config),
  // });
  const questionsResultQueryData = useQuery<IQuestionsModel>({
    service: (args, config) =>
      service.fetchQuestionsResult(
        { questionnaireId, assessmentId, page: 0, size: 50 },
        config
      ),
  });
  const fetchPathInfo = useQuery({
    service: (args, config) =>
      service.fetchPathInfo({ questionnaireId,assessmentId, ...(args || {}) }, config),
    runOnMount: true,
  });
  useEffect(() => {
    if (questionsResultQueryData.loaded) {
      const { items = [] } = questionsResultQueryData.data;
      dispatch(
        questionActions.setQuestionsInfo({
          total_number_of_questions: items.length,
          resultId: "",
          questions: items,
        })
      );
    }
  }, [questionsResultQueryData.loading]);
  const reloadQuestions = async () => {
    try {
      const response = await questionsResultQueryData.query();
      if (response) {
        const { items = [] } = response;
        console.log(items)
        dispatch(
          questionActions.setQuestionsInfo({
            total_number_of_questions: items.length,
            resultId: "",
            questions: items,
          })
        );
      }
    } catch (e) {}
  };
  useEffect(() => {
    if (assessmentStatus === EAssessmentStatus.DONE) {
      reloadQuestions();
    }
  }, [assessmentStatus]);

  return {
    questionsResultQueryData,
    // questionnaireQueryData,
    fetchPathInfo,
  };
};

export default QuestionsContainer;
