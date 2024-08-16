const setDocumentTitle = (str: string = "", appLabel: string = "") => {
  document.title = `${str}${str ? " | " : ""}${appLabel}`;
};

export default setDocumentTitle;
