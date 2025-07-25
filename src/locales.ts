import type { LocaleConfig } from "./types";

export const LOCALES: LocaleConfig[] = [
	{ code: "da", name: "Dansk", cronstrueLocale: "da" },
	{ code: "de", name: "Deutsch", cronstrueLocale: "de" },
	{ code: "en", name: "English", cronstrueLocale: "en" },
	{ code: "eo", name: "Esperanto" },
	{ code: "es", name: "Español", cronstrueLocale: "es" },
	{ code: "fi", name: "Suomi", cronstrueLocale: "fi" },
	{ code: "fr", name: "Français", cronstrueLocale: "fr" },
	{ code: "it", name: "Italiano", cronstrueLocale: "it" },
	{ code: "nb", name: "Norsk Bokmål", cronstrueLocale: "nb" },
	{ code: "nl", name: "Nederlands", cronstrueLocale: "nl" },
	{ code: "pl", name: "Polski", cronstrueLocale: "pl" },
	{ code: "pt-BR", name: "Português (Brasil)", cronstrueLocale: "pt_BR" },
	{ code: "pt-PT", name: "Português (Portugal)", cronstrueLocale: "pt_PT" },
	{ code: "ro", name: "Română", cronstrueLocale: "ro" },
	{ code: "sv", name: "Svenska", cronstrueLocale: "sv" },
	{ code: "tr", name: "Türkçe", cronstrueLocale: "tr" },
	{ code: "uk", name: "Українська", cronstrueLocale: "uk" },
];

export const SUPPORTED_LANGUAGE_CODES = LOCALES.map((l) => l.code);

export function getLocaleConfig(code: string): LocaleConfig | undefined {
	return LOCALES.find((l) => l.code === code);
}
