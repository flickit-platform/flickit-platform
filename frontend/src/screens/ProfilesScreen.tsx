import { t } from "i18next";
import ProfilesContainer from "../components/profile/ProfilesContainer";
import useDocumentTitle from "../utils/useDocumentTitle";

const ProfilesListTabScreen = () => {
  useDocumentTitle(t("profiles") as string);

  return <ProfilesContainer />;
};

export default ProfilesListTabScreen;
