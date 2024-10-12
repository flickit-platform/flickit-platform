import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./translations/en.json";
import fa from "./translations/fa.json";

export const resources = {
  en: {
    translation: en,
  },
  fa: {
    translation: fa,
  },
};
const storedLanguage = "en";
document.dir = "ltr";
i18n.use(initReactI18next).init({
  resources,
  lng: storedLanguage,
  fallbackLng: "fa",

  interpolation: {
    escapeValue: false,
  },
});
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("lang", lng);
});
