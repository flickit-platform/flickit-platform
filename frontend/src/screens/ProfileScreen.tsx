import { t } from "i18next";
import ProfileContainer from "../components/profile/ProfileContainer";
import useDocumentTitle from "../utils/useDocumentTitle";

const ProfileScreen = () => {
  useDocumentTitle(t("profile") as string);
  return <ProfileContainer />;
};

export default ProfileScreen;
