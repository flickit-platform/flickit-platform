import { IProfile, TId } from "../../types";

export enum COMPARE_ACTIONS_TYPE {
  SET_PROFILE = "SET_PROFILE",
  SET_ASSESSMENT_IDS = "SET_ASSESSMENT_IDS",
}

export const setAssessmentIds = (payload: TId[]) => {
  return { payload, type: COMPARE_ACTIONS_TYPE.SET_ASSESSMENT_IDS };
};

export const setProfile = (payload: IProfile | null) => {
  return { payload, type: COMPARE_ACTIONS_TYPE.SET_PROFILE };
};

export const compareActions = {
  setProfile,
  setAssessmentIds,
};
