import { IQuestionInfo } from "@types";
import { QUESTION_ACTIONS_TYPE } from "./actions";

const questionReducer = (
  prevState: any,
  action: { type: QUESTION_ACTIONS_TYPE; payload: any },
) => {
  switch (action.type) {
    case QUESTION_ACTIONS_TYPE.GO_TO_QUESTION:
      return {
        ...prevState,
        questionIndex: action.payload || prevState.questionIndex,
      };
    case QUESTION_ACTIONS_TYPE.SET_ASSESSMENT_STATUS:
      return {
        ...prevState,
        assessmentStatus: action.payload,
      };
    case QUESTION_ACTIONS_TYPE.SET_QUESTIONS_INFO:
      return {
        ...prevState,
        questionsInfo: action.payload,
      };
    case QUESTION_ACTIONS_TYPE.SET_QUESTION_INFO:
      return {
        ...prevState,
        questionsInfo: {
          ...prevState.questionsInfo,
          questions: prevState.questionsInfo.questions.map(
            (question: IQuestionInfo) => {
              if (action.payload.index !== question.index) {
                return question;
              }
              return action.payload;
            },
          ),
        },
      };
    case QUESTION_ACTIONS_TYPE.SET_SUBMIT_ON_ANSWER_SELECTION:
      return {
        ...prevState,
        submitOnAnswerSelection: action.payload,
      };
    case QUESTION_ACTIONS_TYPE.SET_SELCTED_CONFIDENCE_LEVEL:
      return {
        ...prevState,
        selcetedConfidenceLevel: action.payload,
      };

    case QUESTION_ACTIONS_TYPE.SET_IS_SUBMITTING:
      return {
        ...prevState,
        isSubmitting: action.payload,
      };
    case QUESTION_ACTIONS_TYPE.SET_EVIDENCE_DESCRIPTION:
      return {
        ...prevState,
        evidences: action.payload,
      };
    default:
      return prevState;
  }
};

export default questionReducer;
