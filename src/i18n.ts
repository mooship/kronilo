import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import { SUPPORTED_LANGUAGE_CODES } from "./locales";

/**
 * i18n initialization
 *
 * Exposes a configured i18next instance and a convenience `initI18n` function
 * that initializes the instance with sensible defaults for this app. It
 * leverages `i18next-http-backend` to load locale files and the browser
 * language detector to choose a language, with `localStorage` used for
 * caching the user's selection.
 */
const i18nInstance = i18n
	.use(HttpBackend)
	.use(LanguageDetector)
	.use(initReactI18next);

export const initI18n = () => {
	return i18nInstance.init({
		fallbackLng: "en",
		supportedLngs: SUPPORTED_LANGUAGE_CODES,
		debug: false,
		defaultNS: "translation",
		keySeparator: ".",
		interpolation: {
			escapeValue: false,
		},
		backend: {
			loadPath: "/locales/{{lng}}/{{ns}}.json",
		},
		detection: {
			order: ["localStorage", "navigator"],
			caches: ["localStorage"],
		},
		react: {
			useSuspense: true,
		},
	});
};

export default i18nInstance;
