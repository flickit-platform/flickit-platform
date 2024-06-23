import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import reducer, { initialState, AppState } from "./reducer";
import { ActionTypes } from "./actions";
import { useServiceContext } from "../ServiceProvider";

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<any>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppConfigContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const ActionProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { service } = useServiceContext();

  useEffect(() => {
    const config = undefined;
    service.fetchTenantInfo(config).then((res: any) => {
      const appTitle = res.data.name;
      dispatch({
        type: ActionTypes.SET_APP_TITLE,
        payload: appTitle,
      });
      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      if (metaDescription) {
        metaDescription.setAttribute(
          "content",
          `The ${appTitle} makes it easy to evaluate software systems. You can publish your evaluation assessment kit or use available assessment kits and get helpful insights.`
        );
      }

      // Update title tag
      document.title = appTitle;
    });
    service.fetchTenantLogo(config).then((res: any) => {
      dispatch({
        type: ActionTypes.SET_APP_LOGO_URL,
        payload: res.data.logoLink,
      });
    });
  }, []);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
