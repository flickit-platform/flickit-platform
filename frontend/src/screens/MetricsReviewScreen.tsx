import { t } from "i18next";
import MetricsContainer from "../components/metrics/MetricsContainer";
import MetricsReview from "../components/metrics/MetricsReview";
import { MetricProvider } from "../providers/MetricProvider";
import useDocumentTitle from "../utils/useDocumentTitle";

const MetricsReviewContainer = () => {
  useDocumentTitle(t("reviewQuestions") as string);

  return (
    <MetricProvider>
      <MetricsContainer isReview={true}>
        <MetricsReview />
      </MetricsContainer>
    </MetricProvider>
  );
};

export default MetricsReviewContainer;
