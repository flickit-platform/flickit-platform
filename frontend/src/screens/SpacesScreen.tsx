import { t } from "i18next";
import SpaceContainer from "../components/spaces/SpaceContainer";
import useDocumentTitle from "../utils/useDocumentTitle";

const SpacesScreen = () => {
  useDocumentTitle(t("spaces") as string);

  return <SpaceContainer />;
};

export default SpacesScreen;
