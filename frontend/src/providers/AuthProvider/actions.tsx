import axios from "axios";
import { ISpaceInfo, IUserInfo } from "../../types";
import { defaultUserInfo } from "./provider";

export enum AUTH_ACTIONS_TYPE {
  SIGN_IN = "SIGN_IN",
  SIGN_UP = "SIGN_UP",
  SIGN_OUT = "SIGN_OUT",
  SET_USER_INFO = "SET_USER_INFO",
  SET_ACCESS_TOKEN = "SET_ACCESS_TOKEN",
  SET_CURRENT_SPACE = "SET_CURRENT_SPACE",
  SET_USER_INFO_LOADING = "SET_USER_INFO_LOADING",
}

interface ISignInPayload {
  refresh?: string;
  access?: string;
}

export const signIn = (payload: ISignInPayload = {}) => {
  if (payload.refresh && payload.access) {
    axios.defaults.headers["Authorization"] = `JWT ${payload.access}`;
    localStorage.setItem("refreshToken", JSON.stringify(payload.refresh));
    localStorage.setItem("accessToken", JSON.stringify(payload.access));
  }
  return { type: AUTH_ACTIONS_TYPE.SIGN_IN, payload };
};

export const setAccessToken = (payload: string) => {
  if (payload) {
    localStorage.setItem("accessToken", JSON.stringify(payload));
  } else {
    localStorage.removeItem("accessToken");
  }
  return { type: AUTH_ACTIONS_TYPE.SET_ACCESS_TOKEN, payload };
};

export const setUserInfo = (payload: IUserInfo = defaultUserInfo) => {
  return { payload, type: AUTH_ACTIONS_TYPE.SET_USER_INFO };
};

export const setCurrentSpace = (payload: ISpaceInfo) => {
  return { payload, type: AUTH_ACTIONS_TYPE.SET_CURRENT_SPACE };
};

export const signUp = () => {
  return { type: AUTH_ACTIONS_TYPE.SIGN_UP };
};

export const setUserInfoLoading = (payload: boolean) => {
  return { type: AUTH_ACTIONS_TYPE.SET_USER_INFO_LOADING, payload };
};

export const signOut = () => {
  localStorage.clear();
  axios.defaults.headers["Authorization"] = ``;
  return { type: AUTH_ACTIONS_TYPE.SIGN_OUT };
};

export const authActions = {
  signIn,
  signUp,
  signOut,
  setUserInfo,
  setAccessToken,
  setCurrentSpace,
  setUserInfoLoading,
};
