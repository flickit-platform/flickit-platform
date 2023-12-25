import { t } from "i18next";
import AssessmentKitPermissionsContainer from "@/components/assessment-kit/AssessmentKitPermissionsContainer";
import useDocumentTitle from "@utils/useDocumentTitle";

const AssessmentKitPermissionsScreen = () => {
  useDocumentTitle(t("assessmentKit") as string);
  return <AssessmentKitPermissionsContainer />;
};

export default AssessmentKitPermissionsScreen;
