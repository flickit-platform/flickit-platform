import { IAssessmentKit, TId } from "@types";

export enum COMPARE_ACTIONS_TYPE {
  SET_ASSESSMENT_KIT = "SET_ASSESSMENT_KIT",
  SET_ASSESSMENT_IDS = "SET_ASSESSMENT_IDS",
  SET_ASSESSMENT_LOADING = "SET_ASSESSMENT_LOADING",
}

export const setAssessmentIds = (payload: TId[]) => {
  return { payload, type: COMPARE_ACTIONS_TYPE.SET_ASSESSMENT_IDS };
};

export const setAssessmentKit = (payload: IAssessmentKit[]) => {
  return { payload, type: COMPARE_ACTIONS_TYPE.SET_ASSESSMENT_KIT };
};

export const setAssessmentLoading = (payload: boolean) => {
  return { payload, type: COMPARE_ACTIONS_TYPE.SET_ASSESSMENT_LOADING };
};

export const compareActions = {
  setAssessmentKit,
  setAssessmentIds,
  setAssessmentLoading,
};
