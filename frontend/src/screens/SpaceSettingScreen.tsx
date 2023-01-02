import { t } from "i18next";
import SpaceSettingContainer from "../components/spaces/SpaceSettingContainer";
import useDocumentTitle from "../utils/useDocumentTitle";

const SpaceSettingScreen = () => {
  useDocumentTitle(t("spaceSettingT") as string);

  return <SpaceSettingContainer />;
};

export default SpaceSettingScreen;
