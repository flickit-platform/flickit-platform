import { t } from "i18next";
import ProfileExpertViewContainer from "@components/profile/ProfileExpertViewContainer";
import useDocumentTitle from "@utils/useDocumentTitle";

const ProfileExpertViewScreen = () => {
  useDocumentTitle(t("profile") as string);
  return <ProfileExpertViewContainer />;
};

export default ProfileExpertViewScreen;
