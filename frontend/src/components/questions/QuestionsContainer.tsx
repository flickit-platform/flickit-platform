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
import { IQuestion, IQuestionnaireModel, IQuestionsModel, TId } from "@types";
import toastError from "@/utils/toastError";
import { ICustomError } from "@/utils/CustomError";

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
  const { questions, questionsResultQueryData, fetchPathInfo } = useQuestions();

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

export const useQuestions = () => {
  const { service } = useServiceContext();
  const [resultId, setResultId] = useState<TId | undefined>(undefined);
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [page, setPage] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const dispatch = useQuestionDispatch();
  const { assessmentStatus } = useQuestionContext();
  const { questionnaireId = "", assessmentId = "", questionIndex = 0 } = useParams();

  const questionsResultQueryData = useQuery<IQuestionsModel>({
    service: (args, config) =>
      service.fetchQuestionsResult(
        { questionnaireId, assessmentId, page: args.page, size: 50 },
        config
      ),
    runOnMount: false, // We'll handle the initial run ourselves
  });

  const fetchPathInfo = useQuery({
    service: (args, config) =>
      service.fetchPathInfo({ questionnaireId, assessmentId, ...(args || {}) }, config),
    runOnMount: true,
  });

  // Fetch the initial set of questions (page 0) on mount
  useEffect(() => {
    const fetchInitialQuestions = async () => {
      try {
        const response = await questionsResultQueryData.query({ page: 0 });
        if (response) {
          const { items = [], permissions, total } = response;
          setQuestions(items);
          setTotalQuestions(total);
          dispatch(
            questionActions.setQuestionsInfo({
              total_number_of_questions: total,
              resultId: "",
              questions: items,
              permissions: permissions,
            })
          );
          console.log("Initial questions loaded:", items);
        }
      } catch (e) {
        console.error("Failed to load initial questions", e);
        toastError(e as ICustomError);
      }
    };

    fetchInitialQuestions();
  }, []);

  const loadMoreQuestions = async (newPage: number) => {
    try {
      const response = await questionsResultQueryData.query({ page: newPage });
      if (response) {
        const { items = [], permissions, total } = response;
        setQuestions((prevQuestions) => [...prevQuestions, ...items]);
        setTotalQuestions(total);
        dispatch(
          questionActions.setQuestionsInfo({
            total_number_of_questions: total,
            resultId: "",
            questions: [...questions, ...items],
            permissions: permissions,
          })
        );
        console.log("More questions loaded:", items);
      }
    } catch (e) {
      console.error("Failed to load more questions", e);
      toastError(e as ICustomError);
    }
  };

  useEffect(() => {
    const currentIndex = Number(questionIndex);
    if (currentIndex > questions.length && currentIndex <= totalQuestions) {
      const newPage = Math.floor((currentIndex - 1) / 50);
      if (newPage > page) {
        setPage(newPage);
        loadMoreQuestions(newPage);
      }
    }
  }, [questionIndex, questions.length, totalQuestions]);

  useEffect(() => {
    if (assessmentStatus === EAssessmentStatus.DONE) {
      loadMoreQuestions(page);
    }
  }, [assessmentStatus]);

  return {
    questions,
    questionsResultQueryData,
    fetchPathInfo,
  };
};
export default QuestionsContainer;
