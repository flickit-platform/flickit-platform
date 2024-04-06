export const BASE_URL =
  process.env.NODE_ENV === "development"
    ? import.meta.env.VITE_LOCAL_BASE_URL || "https://app.test.flickit.org"
    : process.env.BASE_URL;
export const APP_LABEL = "Flickit";

const clarityScriptTag = import.meta.env.VITE_CLARITY_SCRIPT_TAG;

if (clarityScriptTag) {
  const parser = new DOMParser();
  const htmlDocument = parser.parseFromString(clarityScriptTag, "text/html");
  const scriptElement = htmlDocument.head.querySelector("script");

  if (scriptElement) {
    document.head.appendChild(scriptElement);
  }
}
