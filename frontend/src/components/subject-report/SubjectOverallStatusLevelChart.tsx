import VerticalLevelChart from "@common/charts/VerticalLevelChart";

const SubjectOverallStatusLevelChart = (props: any) => {
  const { data = {}, loading } = props;
  const { confidence_level_value: cl = 1, subject } = data;
  const { title, maturity_level, confidence_value } = subject;
  return (
    <VerticalLevelChart
      cl={Math.ceil(confidence_value)}
      ml={maturity_level.index}
      title={title}
      status={maturity_level.title}
      loading={loading}
      mn={maturity_level.maturity_levels_count}
    />
  );
};

export default SubjectOverallStatusLevelChart;
