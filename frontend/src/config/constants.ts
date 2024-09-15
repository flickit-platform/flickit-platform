export const BASE_URL =
  process.env.NODE_ENV === "development"
    ? import.meta.env.VITE_LOCAL_BASE_URL
    : process.env.BASE_URL;
export const APP_LABEL = import.meta.env.VITE_APP_TITLE;
