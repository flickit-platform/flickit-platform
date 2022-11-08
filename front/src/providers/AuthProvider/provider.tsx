import React, { useReducer, FC, useContext, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IUserInfo } from "../../types";
import { appActions, useAppDispatch } from "../AppProvider";
import authReducer from "./reducer";

interface IAuthProviderProps {
  children?: JSX.Element | JSX.Element[];
}

export interface IAuthContext {
  isAuthenticatedUser: boolean | null;
  userInfo: IUserInfo;
  accessToken: string;
  loadingUserInfo: boolean;
  dispatch: React.Dispatch<any>;
}

export const defaultUserInfo = {
  username: "",
  last_name: "",
  id: "",
  first_name: "",
  email: "",
  current_space: null,
};

const getAccessTokenFormStorage = () => {
  try {
    const token = localStorage.getItem("accessToken");
    return token ? JSON.parse(token) : "";
  } catch (e) {
    return "";
  }
};

export const AuthContext = React.createContext<IAuthContext>({
  isAuthenticatedUser: false,
  accessToken: getAccessTokenFormStorage(),
  loadingUserInfo: true,
  userInfo: defaultUserInfo,
  dispatch: () => {},
});

export const AuthProvider: FC<IAuthProviderProps> = ({ children }) => {
  // const appDispatch = useAppDispatch();
  // const navigate = useNavigate();

  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticatedUser: false,
    accessToken: getAccessTokenFormStorage(),
    loadingUserInfo: true,
    userInfo: defaultUserInfo,
    dispatch: () => {},
  });

  // useEffect(() => {
  //   if (state.isAuthenticatedUser === null) {
  //     return;
  //   }
  //   if (state.isAuthenticatedUser) {
  //     navigate("/", { replace: true });
  //   } else {
  //     navigate("/sign-in", {
  //       replace: true,
  //     });
  //   }
  // }, [state.isAuthenticatedUser]);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within a AuthProvider");
  }
  return context;
};
