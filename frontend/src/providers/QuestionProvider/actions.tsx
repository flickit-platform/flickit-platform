import { IQuestionInfo, TQuestionsInfo } from "@types";
import { EAssessmentStatus } from "./provider";

export enum QUESTION_ACTIONS_TYPE {
  GO_TO_QUESTION = "GO_TO_QUESTION",
  SET_QUESTIONS_INFO = "SET_QUESTIONS_INFO",
  SET_QUESTION_INFO = "SET_QUESTION_INFO",
  SET_ASSESSMENT_STATUS = "SET_ASSESSMENT_STATUS",
  SET_SUBMIT_ON_ANSWER_SELECTION = "SET_SUBMIT_ON_ANSWER_SELECTION",
  SET_SELCTED_CONFIDENCE_LEVEL = "SET_SELCTED_CONFIDENCE_LEVEL",
  SET_IS_SUBMITTING = "SET_IS_SUBMITTING",
  SET_EVIDENCE_DESCRIPTION = "SET_EVIDENCE_DESCRIPTION",
}

export const goToQuestion = function (payload: number | string | undefined) {
  try {
    const questionIndex = Number(payload);

    return {
      payload: questionIndex,
      type: QUESTION_ACTIONS_TYPE.GO_TO_QUESTION,
    };
  } catch (e) {
    console.error("question index must be a number");
  }
};

export const setQuestionsInfo = function (payload: TQuestionsInfo) {
  return { payload, type: QUESTION_ACTIONS_TYPE.SET_QUESTIONS_INFO };
};

export const setQuestionInfo = function (payload: IQuestionInfo) {
  return { payload, type: QUESTION_ACTIONS_TYPE.SET_QUESTION_INFO };
};

export const setAssessmentStatus = function (payload: EAssessmentStatus) {
  return { payload, type: QUESTION_ACTIONS_TYPE.SET_ASSESSMENT_STATUS };
};

export const setSubmitOnAnswerSelection = function (payload: boolean) {
  return {
    payload,
    type: QUESTION_ACTIONS_TYPE.SET_SUBMIT_ON_ANSWER_SELECTION,
  };
};
export const setSelectedConfidenceLevel = function (payload: any) {
  return { payload, type: QUESTION_ACTIONS_TYPE.SET_SELCTED_CONFIDENCE_LEVEL };
};

export const setIsSubmitting = function (payload: boolean) {
  return { payload, type: QUESTION_ACTIONS_TYPE.SET_IS_SUBMITTING };
};
export const setEvidenceDescription = function (payload: string) {
  return { payload, type: QUESTION_ACTIONS_TYPE.SET_EVIDENCE_DESCRIPTION };
};

export const questionActions = {
  goToQuestion,
  setQuestionsInfo,
  setQuestionInfo,
  setAssessmentStatus,
  setSubmitOnAnswerSelection,
  setSelectedConfidenceLevel,
  setIsSubmitting,
  setEvidenceDescription,
};
export type TQuestionActions = typeof questionActions;
