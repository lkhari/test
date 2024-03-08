import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import enAuth from "./locales/en/auth.json";
import enCommon from "./locales/en/common.json";
import enError from "./locales/en/errors.json";

export const defaultNS = "common";

void i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: "en",
    defaultNS,
    resources: {
      en: {
        auth: enAuth,
        common: enCommon,
        errors: enError,
      },
    },
  });

export default i18next;
