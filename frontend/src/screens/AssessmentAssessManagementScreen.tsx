import { t } from "i18next";
import useDocumentTitle from "@utils/useDocumentTitle";
import AssessmentAccessManagementContainer from "@components/assessment-accessManagement/AssessmentAccessManagementContainer";

const AssessmentReportScreen = () => {
    useDocumentTitle(`${t("accessManagement")}`);

    return <AssessmentAccessManagementContainer />;
};

export default AssessmentReportScreen;
