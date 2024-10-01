import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./translations/en.json";
import fa from "./translations/fa.json";

const resources = {
  en: {
    translation: en,
  },
  fa: {
    translation: fa,
  },
};
const storedLanguage = localStorage.getItem("lang") || "en";
document.dir = storedLanguage === "fa" ? "rtl" : "ltr"; 
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
