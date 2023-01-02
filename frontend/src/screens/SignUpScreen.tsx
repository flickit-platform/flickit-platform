import { t } from "i18next";
import SignUp from "../components/auth/SignUp";
import useDocumentTitle from "../utils/useDocumentTitle";

const SignUpScreen = () => {
  useDocumentTitle(t("signUp") as string);

  return <SignUp />;
};

export default SignUpScreen;
