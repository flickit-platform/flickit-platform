import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./translations/en.json";
import fr from "./translations/fr.json";
import fa from "./translations/fa.json";
const resources = {
  en: {
    translation: en,
  },
  fa: {
    translation: fa,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },
});
