import React from "react";
import MetricsContainer from "../components/metrics/MetricsContainer";
import MetricsReview from "../components/metrics/MetricsReview";
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
