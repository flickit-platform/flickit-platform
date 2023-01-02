import { t } from "i18next";
import AccountContainer from "../components/account/AccountContainer";
import { useAuthContext } from "../providers/AuthProvider";
import getUserName from "../utils/getUserName";
import useDocumentTitle from "../utils/useDocumentTitle";

const AccountScreen = () => {
  const { userInfo } = useAuthContext();
  useDocumentTitle(`${t("userProfileT")}: ${getUserName(userInfo)}`);

  return <AccountContainer />;
};

export default AccountScreen;
