import VerticalLevelChart from "@common/charts/VerticalLevelChart";

const SubjectOverallStatusLevelChart = (props: any) => {
  const { data = {}, loading } = props;
  const { confidence_level_value: cl = 1, subject, maturityLevelsCount } = data;
  const { title, maturityLevel, confidenceValue } = subject;
  return (
    <VerticalLevelChart
      cl={Math.ceil(confidenceValue)}
      ml={maturityLevel.index}
      title={title}
      status={maturityLevel.title}
      loading={loading}
      mn={maturityLevelsCount}
    />
  );
};

export default SubjectOverallStatusLevelChart;
