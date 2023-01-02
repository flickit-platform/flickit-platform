import { t } from "i18next";
import SubjectContainer from "../components/subject-report/SubjectContainer";
import useDocumentTitle from "../utils/useDocumentTitle";

const SubjectReportScreen = () => {
  useDocumentTitle(t("insight") as string);

  return <SubjectContainer />;
};

export default SubjectReportScreen;
