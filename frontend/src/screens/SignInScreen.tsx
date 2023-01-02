import { t } from "i18next";
import SignIn from "../components/auth/SignIn";
import useDocumentTitle from "../utils/useDocumentTitle";

const SignInScreen = () => {
  useDocumentTitle(t("signIn") as string);

  return <SignIn />;
};

export default SignInScreen;
