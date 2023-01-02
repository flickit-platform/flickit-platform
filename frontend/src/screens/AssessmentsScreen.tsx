import { t } from "i18next";
import AssessmentContainer from "../components/assessments/AssessmentContainer";
import useDocumentTitle from "../utils/useDocumentTitle";

const AssessmentsScreen = () => {
  useDocumentTitle(t("assessments") as string);
  return <AssessmentContainer />;
};

export default AssessmentsScreen;
