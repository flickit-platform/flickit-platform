export const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "https://checkup.asta.ir"
    : process.env.BASE_URL;
