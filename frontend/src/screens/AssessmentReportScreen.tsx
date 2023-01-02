import { t } from "i18next";
import AssessmentReportContainer from "../components/assessment-report/AssessmentReportContainer";
import useDocumentTitle from "../utils/useDocumentTitle";

const AssessmentReportScreen = () => {
  useDocumentTitle(`${t("overallInsights")}`);

  return <AssessmentReportContainer />;
};

export default AssessmentReportScreen;
