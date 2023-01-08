export const BASE_URL =
  process.env.NODE_ENV === "development"
    ? import.meta.env.VITE_LOCAL_BASE_URL || "https://checkuptest.asta.ir"
    : process.env.BASE_URL;

export const APP_LABEL = "Checkup-Platform";
