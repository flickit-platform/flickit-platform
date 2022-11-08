import { IMetricInfo } from "../../types";
import { METRIC_ACTIONS_TYPE } from "./actions";

const metricReducer = (
  prevState: any,
  action: { type: METRIC_ACTIONS_TYPE; payload: any }
) => {
  switch (action.type) {
    case METRIC_ACTIONS_TYPE.GO_TO_METRIC:
      return {
        ...prevState,
        metricIndex: action.payload || prevState.metricIndex,
      };
    case METRIC_ACTIONS_TYPE.SET_ASSESSMENT_STATUS:
      return {
        ...prevState,
        assessmentStatus: action.payload,
      };
    case METRIC_ACTIONS_TYPE.SET_METRICS_INFO:
      return {
        ...prevState,
        metricsInfo: action.payload,
      };
    case METRIC_ACTIONS_TYPE.SET_METRIC_INFO:
      return {
        ...prevState,
        metricsInfo: {
          ...prevState.metricsInfo,
          metrics: prevState.metricsInfo.metrics.map((metric: IMetricInfo) => {
            if (action.payload.index !== metric.index) {
              return metric;
            }
            return action.payload;
          }),
        },
      };
    case METRIC_ACTIONS_TYPE.SET_SUBMIT_ON_ANSWER_SELECTION:
      return {
        ...prevState,
        submitOnAnswerSelection: action.payload,
      };
    case METRIC_ACTIONS_TYPE.SET_IS_SUBMITTING:
      return {
        ...prevState,
        isSubmitting: action.payload,
      };
    default:
      return prevState;
  }
};

export default metricReducer;
