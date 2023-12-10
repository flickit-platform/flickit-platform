export const BASE_URL =
  process.env.NODE_ENV === "development"
    ? import.meta.env.VITE_LOCAL_BASE_URL || "https://test.flickit.org"
    : process.env.BASE_URL;

export const APP_LABEL = "Flickit";

export const KEYCLOACK_URL =
  process.env.NODE_ENV === "development"
    ? import.meta.env.VITE_LOCAL_BASE_URL || "https://test.flickit.org"
    : process.env.KEYCLOACK_URL;
export const KEYCLOACK_REALM =
  process.env.NODE_ENV === "development"
    ? "flickit"
    : process.env.KEYCLOACK_URL;

export const KEYCLOACK_CLIENT_ID =
  process.env.NODE_ENV === "development"
    ? "flickit-frontend"
    : process.env.KEYCLOACK_CLIENT_ID;
