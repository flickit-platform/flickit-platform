import React, {
  useReducer,
  FC,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useParams } from "react-router-dom";
import { TQuestionsInfo } from "@types";
import { questionActions } from "./actions";
import appReducer from "./reducer";

interface IQuestionProviderProps {
  children?: JSX.Element | JSX.Element[];
}

export enum EAssessmentStatus {
  "NOT_STARTED" = "NOT_STARTED",
  "INPROGRESS" = "INPROGRESS",
  "DONE" = "DONE",
}

export interface IQuestionContext {
  questionIndex: number;
  questionsInfo: TQuestionsInfo;
  assessmentStatus: EAssessmentStatus;
  submitOnAnswerSelection: boolean;
  isSubmitting: boolean;
  evidences: string;
  selcetedConfidenceLevel: any;
}

export const QuestionContext = React.createContext<IQuestionContext>({
  questionIndex: 1,
  assessmentStatus: EAssessmentStatus.NOT_STARTED,
  questionsInfo: {
    total_number_of_questions: 0,
    questions: [],
    resultId: undefined,
  },
  submitOnAnswerSelection: false,
  selcetedConfidenceLevel: null,
  isSubmitting: false,
  evidences: "",
});

const QuestionDispatchContext = React.createContext<any>({
  dispatch: () => {},
});

export const QuestionProvider: FC<IQuestionProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, {
    questionIndex: 1,
    questionsInfo: {
      total_number_of_questions: 0,
      questions: undefined,
      assessmentStatus: EAssessmentStatus.NOT_STARTED,
    },
    submitOnAnswerSelection: false,
    selcetedConfidenceLevel: null,
    isSubmitting: false,
    evidences: "",
  });
  const { subjectId } = useParams();

  useEffect(() => {
    localStorage.setItem(
      `${subjectId}_questionIndex`,
      JSON.stringify(state.questionIndex)
    );
  }, [state.questionIndex]);

  useEffect(() => {
    if (state.questionIndex > state.questionsInfo.total_number_of_questions) {
      questionActions.setAssessmentStatus(EAssessmentStatus.DONE);
    }
    if (state.questionIndex <= state.questionsInfo.total_number_of_questions) {
      questionActions.setAssessmentStatus(EAssessmentStatus.INPROGRESS);
    }
  }, [state.questionIndex, state.assessmentStatus]);

  return (
    <QuestionContext.Provider value={state}>
      <QuestionDispatchContext.Provider value={dispatch}>
        {children}
      </QuestionDispatchContext.Provider>
    </QuestionContext.Provider>
  );
};

export const useQuestionContext = () => {
  const context = useContext(QuestionContext);
  if (context === undefined) {
    throw new Error(
      "useQuestionContext must be used within a QuestionProvider"
    );
  }
  return context;
};

export const useQuestionDispatch = () => {
  const context = useContext(QuestionDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useAdaptiveDispatch must be used within a AdaptiveProvider or WiseFormProvider"
    );
  }
  return context;
};
