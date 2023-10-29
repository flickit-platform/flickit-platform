import React, { useReducer, FC, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { IAssessmentKit, TId } from "@types";
import compareReducer from "./reducer";

interface ICompareProviderProps {
  children?: JSX.Element | JSX.Element[];
}

export interface ICompareContext {
  assessmentIds: TId[];
  assessment_kit: IAssessmentKit[];
}
export interface ICompareDispatchContext {
  dispatch: React.Dispatch<any>;
}

export const CompareContext = React.createContext<ICompareContext>({
  assessmentIds: [],
  assessment_kit: [],
});

const CompareDispatchContext = React.createContext<any>({
  dispatch: () => {},
});

export const CompareProvider: FC<ICompareProviderProps> = ({ children }) => {
  const [searchParams] = useSearchParams();
  const assessmentIdsParams = searchParams.getAll("assessmentIds");
  const [state, dispatch] = useReducer(compareReducer, {
    assessmentIds: assessmentIdsParams,
    assessment_kit: [],
  });

  return (
    <CompareContext.Provider value={state}>
      <CompareDispatchContext.Provider value={dispatch}>
        {children}
      </CompareDispatchContext.Provider>
    </CompareContext.Provider>
  );
};

export const useCompareContext = () => {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error("useCompareContext must be used within a CompareProvider");
  }
  return context;
};

export const useCompareDispatch = () => {
  const context = useContext(CompareDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useAdaptiveDispatch must be used within a AdaptiveProvider or WiseFormProvider"
    );
  }
  return context;
};
