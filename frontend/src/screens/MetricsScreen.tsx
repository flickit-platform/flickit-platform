import React from "react";
import { Outlet } from "react-router-dom";
import MetricsContainer from "../components/metrics/MetricsContainer";
import { MetricProvider } from "../providers/MetricProvider";
import useDocumentTitle from "../utils/useDocumentTitle";

const MetricsScreen = () => {
  useDocumentTitle();
  return (
    <MetricProvider>
      <MetricsContainer>
        <Outlet />
      </MetricsContainer>
    </MetricProvider>
  );
};

export default MetricsScreen;
