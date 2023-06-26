import { t } from "i18next";
import AssessmentKitExpertViewContainer from "@/components/assessment-kit/AssessmentKitExpertViewContainer";
import useDocumentTitle from "@utils/useDocumentTitle";

const AssessmentKitExpertViewScreen = () => {
  useDocumentTitle(t("proassessmentKitfile") as string);
  return <AssessmentKitExpertViewContainer />;
};

export default AssessmentKitExpertViewScreen;
