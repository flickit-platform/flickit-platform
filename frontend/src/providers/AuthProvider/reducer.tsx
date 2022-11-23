import { AUTH_ACTIONS_TYPE } from "./actions";
import { IAuthContext } from "./provider";

const authReducer = (
  prevState: any,
  action: { type: AUTH_ACTIONS_TYPE; payload: any }
): IAuthContext => {
  switch (action.type) {
    case AUTH_ACTIONS_TYPE.SIGN_IN:
      return { ...prevState, ...action.payload, isAuthenticatedUser: true };
    case AUTH_ACTIONS_TYPE.SIGN_OUT:
      return { ...prevState, isAuthenticatedUser: false, accessToken: "" };
    case AUTH_ACTIONS_TYPE.SET_ACCESS_TOKEN:
      return { ...prevState, accessToken: action.payload };
    case AUTH_ACTIONS_TYPE.SET_USER_INFO:
      return { ...prevState, userInfo: action.payload };
    case AUTH_ACTIONS_TYPE.SET_USER_INFO_LOADING:
      return { ...prevState, loadingUserInfo: action.payload };
    case AUTH_ACTIONS_TYPE.SET_CURRENT_SPACE:
      return {
        ...prevState,
        userInfo: { ...prevState.userInfo, current_space: action.payload },
      };
    default:
      return prevState;
  }
};

export default authReducer;
