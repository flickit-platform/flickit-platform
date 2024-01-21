import { t } from "i18next";
import AssessmentAdviceContainer from "@components/assessment-report/AssessmentAdviceContainer";
import useDocumentTitle from "@utils/useDocumentTitle";

const AssessmentAdviceScreen = () => {
  useDocumentTitle(`${t("overallInsights")}`);

  return <AssessmentAdviceContainer />;
};

export default AssessmentAdviceScreen;
