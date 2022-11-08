import React, { PropsWithChildren, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useNavigate, useParams } from "react-router-dom";
import { QueryData } from "../../components";
import {
  EAssessmentStatus,
  metricActions,
  useMetricDispatch,
} from "../../providers/MetricProvider";
import { useServiceContext } from "../../providers/ServiceProvider";
import { useQuery } from "../../utils/useQuery";
import LoadingSkeletonOfMetrics from "../../components/loading/LoadingSkeletonOfMetrics";
import MetricsTitle from "./MetricsTitle";

export const MetricsContainer = (
  props: PropsWithChildren<{ isReview?: boolean }>
) => {
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
  const {
    metricsQueryData,
    metricsResultQueryData,
    resultsQueryData,
    categoryQueryData,
  } = useMetrics();

  return (
    <QueryData
      queryBatchData={[
        metricsQueryData,
        metricsResultQueryData,
        resultsQueryData,
        categoryQueryData,
      ]}
      loaded={categoryQueryData.loaded}
      renderLoading={() => <LoadingSkeletonOfMetrics />}
      render={([_, __, ___, categoryData]) => {
        return (
          <>
            <Box py={1}>
              <MetricsTitle data={categoryData} isReview={isReview} />
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

const sortByIndex = (data: any[]) => {
  if (!data || data?.length === 0) {
    return data;
  }
  const newData = data.sort((a: any, b: any) => {
    return a.index - b.index;
  });
  return newData;
};

const createMetricsData = (metrics: any[] = [], results: any[] = []) => {
  const data: any[] = [];
  metrics.forEach((metric) => {
    const res = results.find((res) => {
      if (metric.id == res.metric?.id) {
        return true;
      }
      return false;
    });
    const { answer, id: metricResultId } = res || {};
    if (answer) {
      data.push({ ...metric, answer, metricResultId });
    } else {
      data.push(metric);
    }
  });

  return sortByIndex(data);
};

const useMetrics = () => {
  const { service } = useServiceContext();
  const [resultId, setResultId] = useState(null);
  const dispatch = useMetricDispatch();
  const { metricIndex, categoryId, assessmentId } = useParams();
  const categoryQueryData = useQuery({
    service: () => service.fetchCategory(categoryId),
  });
  const metricsQueryData = useQuery({
    service: () => service.fetchMetrics(categoryId),
  });
  const resultsQueryData = useQuery({
    service: () => service.fetchResults(),
  });
  const metricsResultQueryData = useQuery({
    runOnMount: false,
    service: (resultId: any, categoryId: any) =>
      service.fetchCategoryResult(resultId, categoryId),
  });

  useEffect(() => {
    if (resultsQueryData.loaded) {
      const result = resultsQueryData.data.results.find(
        (item: any) => item?.assessment_project == assessmentId
      );
      const { id: resultId } = result || {};
      setResultId(resultId);
      resultId && metricsResultQueryData.query(resultId, categoryId);
    }
  }, [resultsQueryData.loading]);

  useEffect(() => {
    if (metricsQueryData.loaded && metricsResultQueryData.loaded) {
      const { count, results = [] } = metricsQueryData.data;
      const data = createMetricsData(
        results,
        metricsResultQueryData.data?.results
      );

      dispatch(
        metricActions.setMetricsInfo({
          total_number_of_metrics: count,
          resultId,
          metrics: data,
        })
      );
    }
  }, [metricsQueryData.loading, metricsResultQueryData.loading]);

  return {
    metricsQueryData,
    metricsResultQueryData,
    resultsQueryData,
    categoryQueryData,
  };
};
