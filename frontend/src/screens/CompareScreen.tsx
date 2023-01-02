import { t } from "i18next";
import CompareContainer from "../components/compare/CompareContainer";
import useDocumentTitle from "../utils/useDocumentTitle";

const CompareScreen = () => {
  useDocumentTitle(t("compare") as string);
  return <CompareContainer />;
};

export default CompareScreen;
