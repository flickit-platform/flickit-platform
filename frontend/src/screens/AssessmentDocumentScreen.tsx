import { t } from "i18next";
import useDocumentTitle from "@utils/useDocumentTitle";
import AssessmentExportContainer from "@/components/assessment-export/AssessmentExportContainer";

const AssessmentDocumentScreen = () => {
  useDocumentTitle(`${t("document", { title: "" })}`);

  return <AssessmentExportContainer />;
};

export default AssessmentDocumentScreen;
