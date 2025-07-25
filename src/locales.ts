import type { LocaleConfig } from "./types";

export const LOCALES: LocaleConfig[] = [
	{ code: "en", name: "English", cronstrueLocale: "en" },
	{ code: "fr", name: "Français", cronstrueLocale: "fr" },
	{ code: "de", name: "Deutsch", cronstrueLocale: "de" },
	{ code: "es", name: "Español", cronstrueLocale: "es" },
	{ code: "it", name: "Italiano", cronstrueLocale: "it" },
	{ code: "nl", name: "Nederlands", cronstrueLocale: "nl" },
	{ code: "pt-BR", name: "Português (Brasil)", cronstrueLocale: "pt_BR" },
	{ code: "pt-PT", name: "Português (Portugal)", cronstrueLocale: "pt_PT" },
	{ code: "pl", name: "Polski", cronstrueLocale: "pl" },
	{ code: "sv", name: "Svenska", cronstrueLocale: "sv" },
	{ code: "da", name: "Dansk", cronstrueLocale: "da" },
	{ code: "nb", name: "Norsk Bokmål", cronstrueLocale: "nb" },
	{ code: "fi", name: "Suomi", cronstrueLocale: "fi" },
	{ code: "uk", name: "Українська", cronstrueLocale: "uk" },
	{ code: "ro", name: "Română", cronstrueLocale: "ro" },
	{ code: "eo", name: "Esperanto" },
];

export const SUPPORTED_LANGUAGE_CODES = LOCALES.map((l) => l.code);

export function getLocaleConfig(code: string): LocaleConfig | undefined {
	return LOCALES.find((l) => l.code === code);
}
