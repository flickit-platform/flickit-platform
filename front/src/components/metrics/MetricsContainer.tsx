import React, { PropsWithChildren, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useNavigate, useParams } from "react-router-dom";
import {
  EAssessmentStatus,
  metricActions,
  useMetricDispatch,
} from "../../providers/MetricProvider";
import { useServiceContext } from "../../providers/ServiceProvider";
import { useQuery } from "../../utils/useQuery";
import LoadingSkeletonOfMetrics from "../shared/loadings/LoadingSkeletonOfMetrics";
import MetricsTitle from "./MetricsTitle";
import QueryBatchData from "../shared/QueryBatchData";
import { IQuestionnaireModel, IMetricsModel, TId } from "../../types";

const MetricsContainer = (props: PropsWithChildren<{ isReview?: boolean }>) => {
  const { metricIndex } = useParams();
  const dispatch = useMetricDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!props.isReview && !metricIndex) {
      navigate("./1", { replace: true });
      return;
    }
    if (
      !props.isReview &&
      metricIndex !== "completed" &&
      (isNaN(Number(metricIndex)) ||
        Number(metricIndex) === 0 ||
        Number(metricIndex) < 0)
    ) {
      navigate("./1", { replace: true });
      return;
    }

    if (metricIndex == "completed") {
      dispatch(metricActions.setAssessmentStatus(EAssessmentStatus.DONE));
      return;
    }
    dispatch(metricActions.setAssessmentStatus(EAssessmentStatus.INPROGRESS));
    dispatch(metricActions.goToMetric(metricIndex));
  }, [metricIndex]);

  return (
    <>
      <MetricsContainerC {...props} />
    </>
  );
};

export const MetricsContainerC = (
  props: PropsWithChildren<{ isReview?: boolean }>
) => {
  const { children, isReview = false } = props;
  const { metricsResultQueryData, questionnaireQueryData } = useMetrics();

  return (
    <QueryBatchData<IMetricsModel | IQuestionnaireModel>
      queryBatchData={[metricsResultQueryData, questionnaireQueryData]}
      loaded={questionnaireQueryData.loaded}
      renderLoading={() => <LoadingSkeletonOfMetrics />}
      render={([_, questionnaireData]) => {
        return (
          <>
            <Box py={1}>
              <MetricsTitle
                data={questionnaireData as IQuestionnaireModel}
                isReview={isReview}
              />
            </Box>
            <Box display="flex" justifyContent="center">
              {children}
            </Box>
          </>
        );
      }}
    />
  );
};

const useMetrics = () => {
  const { service } = useServiceContext();
  const [resultId, setResultId] = useState<TId | undefined>(undefined);
  const dispatch = useMetricDispatch();
  const { metricIndex, questionnaireId = "", assessmentId = "" } = useParams();
  const questionnaireQueryData = useQuery<IQuestionnaireModel>({
    service: (args, config) =>
      service.fetchQuestionnaire({ questionnaireId }, config),
  });
  const metricsResultQueryData = useQuery<IMetricsModel>({
    service: (args, config) =>
      service.fetchMetricsResult({ questionnaireId, assessmentId }, config),
  });

  useEffect(() => {
    if (metricsResultQueryData.loaded) {
      const { metrics = [], assessment_result_id } =
        metricsResultQueryData.data;

      dispatch(
        metricActions.setMetricsInfo({
          total_number_of_metrics: metrics.length,
          resultId: assessment_result_id,
          metrics,
        })
      );
    }
  }, [metricsResultQueryData.loading]);

  return {
    metricsResultQueryData,
    questionnaireQueryData,
  };
};

export default MetricsContainer;
