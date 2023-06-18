import VerticalLevelChart from "@common/charts/VerticalLevelChart";

const SubjectOverallStatusLevelChart = (props: any) => {
  const { data = {}, loading } = props;
  const {
    title,
    status,
    confidence_level_value: cl = 1,
    maturity_level_value: ml,
    results,
  } = data;
  const { maturity_level_number: mn } = results[0];
  return (
    <VerticalLevelChart
      cl={cl}
      ml={ml}
      title={title}
      status={status}
      loading={loading}
      mn={mn}
    />
  );
};

export default SubjectOverallStatusLevelChart;
