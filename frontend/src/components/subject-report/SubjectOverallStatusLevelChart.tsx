import VerticalLevelChart from "@common/charts/VerticalLevelChart";

const SubjectOverallStatusLevelChart = (props: any) => {
  const { data = {}, loading } = props;
  const { confidence_level_value: cl = 1, subject } = data;
  const { title, maturity_level } = subject;
  return (
    <VerticalLevelChart
      cl={cl}
      ml={maturity_level.index}
      title={title}
      status={maturity_level.title}
      loading={loading}
      mn={maturity_level.maturity_levels_count}
    />
  );
};

export default SubjectOverallStatusLevelChart;
