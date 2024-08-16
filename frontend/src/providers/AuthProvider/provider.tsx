import React, {
  useReducer,
  FC,
  useContext,
  Dispatch,
  createContext,
} from "react";
import { IUserInfo } from "@types";
import authReducer from "./reducer";

interface IAuthProviderProps {
  children?: JSX.Element | JSX.Element[];
}

export interface IAuthContext {
  isAuthenticatedUser: boolean | null;
  userInfo: IUserInfo;
  accessToken: string;
  loadingUserInfo: boolean;
  redirectRoute: string;
  currentSpace:any;
  dispatch: Dispatch<any>;
}

export const defaultUserInfo = {
  displayName: "",
  id: "",
  email: "",
  // current_space: null,
};

const getAccessTokenFormStorage = () => {
  try {
    const token = localStorage.getItem("accessToken");
    return token ? JSON.parse(token) : "";
  } catch (e) {
    return "";
  }
};

export const AuthContext = createContext<IAuthContext>({
  isAuthenticatedUser: false,
  accessToken: getAccessTokenFormStorage(),
  loadingUserInfo: true,
  userInfo: defaultUserInfo,
  currentSpace: {},
  redirectRoute: "",
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
    currentSpace:{},
    redirectRoute: "",
    dispatch: () => {},
  });

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
