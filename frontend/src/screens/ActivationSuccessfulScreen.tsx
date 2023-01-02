import AccountActivationSuccessful from "../components/auth/AccountActivationSuccessful";
import useDocumentTitle from "../utils/useDocumentTitle";

const ActivationSuccessfulScreen = () => {
  useDocumentTitle();
  return <AccountActivationSuccessful />;
};

export default ActivationSuccessfulScreen;
