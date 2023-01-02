import { APP_LABEL } from "../config/constants";

const setDocumentTitle = (title: string = "") => {
  document.title = `${title}${title ? " - " : ""}${APP_LABEL}`;
};

export default setDocumentTitle;
