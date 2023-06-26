import { t } from "i18next";
import AssessmentKitsContainer from "@/components/assessment-kit/AssessmentKitsContainer";
import useDocumentTitle from "@utils/useDocumentTitle";

const AssessmentKitsListTabScreen = () => {
  useDocumentTitle(t("assessmentKits") as string);

  return <AssessmentKitsContainer />;
};

export default AssessmentKitsListTabScreen;
