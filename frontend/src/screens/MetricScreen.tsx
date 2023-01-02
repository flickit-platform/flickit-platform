import { MetricContainer } from "../components/metrics/MetricContainer";
import useDocumentTitle from "../utils/useDocumentTitle";

const MetricScreen = () => {
  useDocumentTitle();
  return <MetricContainer />;
};

export default MetricScreen;
