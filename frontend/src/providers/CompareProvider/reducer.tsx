import { COMPARE_ACTIONS_TYPE } from "./actions";

const appReducer = (
  prevState: any,
  action: { type: COMPARE_ACTIONS_TYPE; payload: any }
) => {
  switch (action.type) {
    case COMPARE_ACTIONS_TYPE.SET_ASSESSMENT_IDS:
      return {
        ...prevState,
        assessmentIds: action.payload,
      };
    case COMPARE_ACTIONS_TYPE.SET_PROFILE:
      return {
        ...prevState,
        profile: action.payload,
      };
    default:
      return prevState;
  }
};

export default appReducer;
