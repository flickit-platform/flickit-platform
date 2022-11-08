import { APP_ACTIONS_TYPE } from "./actions";

const appReducer = (
  prevState: any,
  action: { type: APP_ACTIONS_TYPE; payload: any }
) => {
  switch (action.type) {
    case APP_ACTIONS_TYPE.AUTHENTICATE_APP:
      return { ...prevState, isAuthenticatedApp: true };
    case APP_ACTIONS_TYPE.UNAUTHENTICATED_APP:
      return { ...prevState, isAuthenticatedApp: false };
    default:
      return prevState;
  }
};

export default appReducer;
