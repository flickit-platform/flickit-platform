import React, { useReducer, FC, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { createService } from "../../service";
import { TService } from "../../service";
import { appActions, useAppDispatch } from "../AppProvider";
import { authActions, useAuthContext } from "../AuthProvider";
import serviceReducer from "./reducer";

interface IServiceProviderProps {
  children?: JSX.Element | JSX.Element[];
}

export interface IServiceContext {
  service: TService;
  dispatch: React.Dispatch<any>;
}

export const ServiceContext = React.createContext<IServiceContext>({
  service: {} as any,
  dispatch: () => {},
});

export const ServiceProvider: FC<IServiceProviderProps> = ({ children }) => {
  const { dispatch: authDispatch } = useAuthContext();
  const signOut = () => authDispatch(authActions.signOut());
  const service = useMemo(() => createService(signOut), []);

  const [state, dispatch] = useReducer(serviceReducer, {
    service,
    dispatch: () => {},
  });

  return (
    <ServiceContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useServiceContext = () => {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error("useServiceContext must be used within a ServiceProvider");
  }
  return context;
};
