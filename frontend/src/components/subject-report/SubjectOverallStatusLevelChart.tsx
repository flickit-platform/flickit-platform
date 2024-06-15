import VerticalLevelChart from "@common/charts/VerticalLevelChart";
import { Gauge } from "../common/charts/Gauge";

const SubjectOverallStatusLevelChart = (props: any) => {
  const { data = {}, loading } = props;
  const { confidence_level_value: cl = 1, subject,maturityLevelsCount } = data;
  const { title, maturityLevel, confidenceValue } = subject;
  return (
  //   <Gauge
  //   systemStatus={maturityLevel?.status}
  //   maturity_level_number={maturityLevelsCount}
  //   level_value={maturityLevel.index}
  //   maturity_level_status={maturityLevel.title}
  //   maxWidth="275px"
  //   mt="auto"
  // />
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
