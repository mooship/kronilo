/**
 * Locale configuration used to drive language switcher and cronstrue locale
 * selection.
 */
export type LocaleConfig = {
	code: string;
	name: string;
	cronstrueLocale?: string;
};
