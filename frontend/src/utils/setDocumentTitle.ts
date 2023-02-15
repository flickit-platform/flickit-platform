import { APP_LABEL } from "@config/constants";

const setDocumentTitle = (str: string = "") => {
  document.title = `${str}${str ? " | " : ""}${APP_LABEL}`;
};

export default setDocumentTitle;
