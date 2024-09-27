import React, { useReducer, FC, useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { IAssessmentKit, TId } from "@types";
import compareReducer from "./reducer";
import { useQuery } from "@/utils/useQuery";
import { useServiceContext } from "../ServiceProvider";
import { COMPARE_ACTIONS_TYPE } from "./actions";

interface ICompareProviderProps {
  children?: JSX.Element | JSX.Element[];
}

export interface ICompareContext {
  assessmentIds: TId[];
  assessment_kit: IAssessmentKit[];
  loading: boolean;
}
export interface ICompareDispatchContext {
  dispatch: React.Dispatch<any>;
}

export const CompareContext = React.createContext<ICompareContext>({
  assessmentIds: [],
  assessment_kit: [],
  loading: false,
});

const CompareDispatchContext = React.createContext<any>({
  dispatch: () => {},
});

export const CompareProvider: FC<ICompareProviderProps> = ({ children }) => {
  const { service } = useServiceContext();
  const [searchParams] = useSearchParams();
  const assessmentIdsParams = searchParams.getAll("assessment_id");
  const [state, dispatch] = useReducer(compareReducer, {
    assessmentIds: assessmentIdsParams,
    assessment_kit: [],
    loading: false,
  });

  useEffect(() => {
    dispatch({
      type: COMPARE_ACTIONS_TYPE.SET_ASSESSMENT_LOADING,
      payload: true,
    });
    const fetchAssessments = async () => {
      try {
        const assessments = await Promise.all(
          assessmentIdsParams.map(async (id) => {
            const { data } = await service.AssessmentsLoad(
              { assessmentId: id },
              {}
            );
            return data;
          })
        );
        dispatch({
          type: COMPARE_ACTIONS_TYPE.SET_ASSESSMENT_KIT,
          payload: assessments,
        });
        dispatch({
          type: COMPARE_ACTIONS_TYPE.SET_ASSESSMENT_LOADING,
          payload: false,
        });
      } catch (error) {
        console.error("Failed to fetch assessments:", error);
        dispatch({
          type: COMPARE_ACTIONS_TYPE.SET_ASSESSMENT_LOADING,
          payload: false,
        });
      }
    };

    if (assessmentIdsParams.length > 0) {
      fetchAssessments();
    } else {
      dispatch({
        type: COMPARE_ACTIONS_TYPE.SET_ASSESSMENT_LOADING,
        payload: false,
      });
    }
  }, []);

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
