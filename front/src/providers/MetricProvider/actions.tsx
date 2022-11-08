import { IMetricInfo, TMetricsInfo } from "../../types";
import { EAssessmentStatus } from "./provider";

export enum METRIC_ACTIONS_TYPE {
  GO_TO_METRIC = "GO_TO_METRIC",
  SET_METRICS_INFO = "SET_METRICS_INFO",
  SET_METRIC_INFO = "SET_METRIC_INFO",
  SET_ASSESSMENT_STATUS = "SET_ASSESSMENT_STATUS",
  SET_SUBMIT_ON_ANSWER_SELECTION = "SET_SUBMIT_ON_ANSWER_SELECTION",
  SET_IS_SUBMITTING = "SET_IS_SUBMITTING",
}

export const goToMetric = function (payload: number | string | undefined) {
  try {
    const metricIndex = Number(payload);

    return { payload: metricIndex, type: METRIC_ACTIONS_TYPE.GO_TO_METRIC };
  } catch (e) {
    console.error("metric index must be a number");
  }
};

export const setMetricsInfo = function (payload: TMetricsInfo) {
  return { payload, type: METRIC_ACTIONS_TYPE.SET_METRICS_INFO };
};

export const setMetricInfo = function (payload: IMetricInfo) {
  return { payload, type: METRIC_ACTIONS_TYPE.SET_METRIC_INFO };
};

export const setAssessmentStatus = function (payload: EAssessmentStatus) {
  return { payload, type: METRIC_ACTIONS_TYPE.SET_ASSESSMENT_STATUS };
};

export const setSubmitOnAnswerSelection = function (payload: boolean) {
  return { payload, type: METRIC_ACTIONS_TYPE.SET_SUBMIT_ON_ANSWER_SELECTION };
};

export const setIsSubmitting = function (payload: boolean) {
  return { payload, type: METRIC_ACTIONS_TYPE.SET_IS_SUBMITTING };
};

export const metricActions = {
  goToMetric,
  setMetricsInfo,
  setMetricInfo,
  setAssessmentStatus,
  setSubmitOnAnswerSelection,
  setIsSubmitting,
};
export type TMetricActions = typeof metricActions;
