import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

const i18nInstance = i18n
	.use(HttpBackend)
	.use(LanguageDetector)
	.use(initReactI18next);

export const initI18n = () => {
	return i18nInstance.init({
		fallbackLng: "en",
		supportedLngs: ["en", "fr", "de", "es"],
		debug: false,
		interpolation: {
			escapeValue: false,
		},
		backend: {
			loadPath: "/locales/{{lng}}/{{ns}}.json",
		},
		detection: {
			order: ["navigator"],
			caches: [],
		},
		react: {
			useSuspense: true,
		},
	});
};

export default i18nInstance;
