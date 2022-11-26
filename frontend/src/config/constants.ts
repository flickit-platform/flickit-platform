export const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "https://checkuptest.asta.ir"
    : process.env.BASE_URL;
