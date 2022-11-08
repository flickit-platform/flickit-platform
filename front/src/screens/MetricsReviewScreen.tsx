import React from "react";
import { MetricsContainer } from "../containers/metrics/MetricsContainer";
import { MetricsReview } from "../containers/metrics/MetricsReview";
import { MetricProvider } from "../providers/MetricProvider";

const MetricsReviewContainer = () => {
  return (
    <MetricProvider>
      <MetricsContainer isReview={true}>
        <MetricsReview />
      </MetricsContainer>
    </MetricProvider>
  );
};

export default MetricsReviewContainer;
