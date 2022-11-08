import React from "react";
import VerticalLevelChart from "../../components/charts/VerticalLevelChart";

const SubjectOverallStatusLevelChart = (props: any) => {
  const { data = {}, loading } = props;
  const {
    title,
    status,
    confidence_level_value: cl = 1,
    maturity_level_value: ml,
  } = data;

  return (
    <VerticalLevelChart
      cl={cl}
      ml={ml}
      title={title}
      status={status}
      loading={loading}
    />
  );
};

export default SubjectOverallStatusLevelChart;
