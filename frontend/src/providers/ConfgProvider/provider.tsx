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
  config: AppState;
  dispatch: React.Dispatch<any>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useConfigContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const ConfigProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [config, dispatch] = useReducer(reducer, initialState);
  const { service } = useServiceContext();

  useEffect(() => {
    service.fetchTenantInfo(undefined).then((res: any) => {
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
    service.fetchTenantLogo(undefined).then((res: any) => {
      dispatch({
        type: ActionTypes.SET_APP_LOGO_URL,
        payload: res.data.logoLink,
      });
      const favIcon = document.querySelector('link[rel="icon"]');
      if (favIcon) {
        favIcon.setAttribute("href", res.data.favLink);
      }
    });
  }, []);
  return (
    <AppContext.Provider value={{ config, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
