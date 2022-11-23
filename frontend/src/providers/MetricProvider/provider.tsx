import React, {
  useReducer,
  FC,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IMetricInfo, TMetricsInfo } from "../../types";
import { metricActions, TMetricActions } from "./actions";
import appReducer from "./reducer";

interface IMetricProviderProps {
  children?: JSX.Element | JSX.Element[];
}

export enum EAssessmentStatus {
  "NOT_STARTED" = "NOT_STARTED",
  "INPROGRESS" = "INPROGRESS",
  "DONE" = "DONE",
}

export interface IMetricContext {
  metricIndex: number;
  metricsInfo: TMetricsInfo;
  assessmentStatus: EAssessmentStatus;
  submitOnAnswerSelection: boolean;
  isSubmitting: boolean;
}

export const MetricContext = React.createContext<IMetricContext>({
  metricIndex: 1,
  assessmentStatus: EAssessmentStatus.NOT_STARTED,
  metricsInfo: {
    total_number_of_metrics: 0,
    metrics: undefined,
    resultId: undefined,
  },
  submitOnAnswerSelection: false,
  isSubmitting: false,
});

const MetricDispatchContext = React.createContext<any>({
  dispatch: () => {},
});

export const MetricProvider: FC<IMetricProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, {
    metricIndex: 1,
    metricsInfo: {
      total_number_of_metrics: 0,
      metrics: undefined,
      assessmentStatus: EAssessmentStatus.NOT_STARTED,
    },
    submitOnAnswerSelection: false,
    isSubmitting: false,
  });
  const { subjectId } = useParams();

  useEffect(() => {
    localStorage.setItem(
      `${subjectId}_metricIndex`,
      JSON.stringify(state.metricIndex)
    );
  }, [state.metricIndex]);

  useEffect(() => {
    if (state.metricIndex > state.metricsInfo.total_number_of_metrics) {
      metricActions.setAssessmentStatus(EAssessmentStatus.DONE);
    }
    if (state.metricIndex <= state.metricsInfo.total_number_of_metrics) {
      metricActions.setAssessmentStatus(EAssessmentStatus.INPROGRESS);
    }
  }, [state.metricIndex, state.assessmentStatus]);

  return (
    <MetricContext.Provider value={state}>
      <MetricDispatchContext.Provider value={dispatch}>
        {children}
      </MetricDispatchContext.Provider>
    </MetricContext.Provider>
  );
};

export const useMetricContext = () => {
  const context = useContext(MetricContext);
  if (context === undefined) {
    throw new Error("useMetricContext must be used within a MetricProvider");
  }
  return context;
};

export const useMetricDispatch = () => {
  const context = useContext(MetricDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useAdaptiveDispatch must be used within a AdaptiveProvider or WiseFormProvider"
    );
  }
  return context;
};
