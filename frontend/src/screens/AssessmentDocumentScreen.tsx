import { t } from "i18next";
import useDocumentTitle from "@utils/useDocumentTitle";
import AssessmentExportContainer from "@/components/assessment-export/AssessmentExportContainer";

const AssessmentDocumentScreen = () => {
    useDocumentTitle(`${t("assessmentDocument")}`);

    return <AssessmentExportContainer />;
};

export default AssessmentDocumentScreen;
