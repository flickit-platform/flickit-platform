import axios from "axios";
import { ISpaceInfo, IUserInfo } from "../../types";

export enum AUTH_ACTIONS_TYPE {
  SIGN_IN = "SIGN_IN",
  SIGN_UP = "SIGN_UP",
  SIGN_OUT = "SIGN_OUT",
  SET_USER_INFO = "SET_USER_INFO",
  SET_CURRENT_SPACE = "SET_CURRENT_SPACE",
}

interface ISignInPayload {
  refresh: string;
  access: string;
}

export const signIn = (payload: ISignInPayload) => {
  //@ts-expect-error
  axios.defaults.headers["Authorization"] = `JWT ${payload.access}`;
  localStorage.setItem("isAuthenticatedUser", JSON.stringify(true));
  localStorage.setItem("refreshToken", JSON.stringify(payload.refresh));
  localStorage.setItem("accessToken", JSON.stringify(payload.access));
  return { type: AUTH_ACTIONS_TYPE.SIGN_IN };
};

export const setUserInfo = (payload: IUserInfo) => {
  return { payload, type: AUTH_ACTIONS_TYPE.SET_USER_INFO };
};

export const setCurrentSpace = (payload: ISpaceInfo) => {
  return { payload, type: AUTH_ACTIONS_TYPE.SET_CURRENT_SPACE };
};

export const signUp = () => {
  return { type: AUTH_ACTIONS_TYPE.SIGN_UP };
};

export const signOut = () => {
  localStorage.clear();
  return { type: AUTH_ACTIONS_TYPE.SIGN_OUT };
};

export const authActions = {
  signIn,
  signUp,
  signOut,
  setUserInfo,
  setCurrentSpace,
};
