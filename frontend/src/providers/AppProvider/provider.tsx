import React, { useReducer, FC, useContext } from "react";
import appReducer from "./reducer";

interface IAppProviderProps {
  children?: JSX.Element | JSX.Element[];
}

export interface IAppContext {
  dispatch: React.Dispatch<any>;
}

export const AppContext = React.createContext<IAppContext>({
  dispatch: () => {},
});

const AppDispatchContext = React.createContext<any>({
  dispatch: () => {},
});

export const AppProvider: FC<IAppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, {
    dispatch: () => {},
  });

  return (
    <AppContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppProvider");
  }
  return context;
};

export const useAppDispatch = () => {
  const context = useContext(AppDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useAdaptiveDispatch must be used within a AdaptiveProvider or WiseFormProvider"
    );
  }
  return context;
};
