import { t } from "i18next";
import ExpertGroupContainer from "../components/expert-groups/ExpertGroupContainer";
import { useAuthContext } from "../providers/AuthProvider";
import getUserName from "../utils/getUserName";
import useDocumentTitle from "../utils/useDocumentTitle";

const ExpertGroupScreen = () => {
  const { userInfo } = useAuthContext();
  useDocumentTitle(`${t("expertGroupT")}: ${getUserName(userInfo)}`);

  return <ExpertGroupContainer />;
};

export default ExpertGroupScreen;
