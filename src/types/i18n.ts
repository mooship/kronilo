/**
 * I18n-friendly cron error object used for translation keys and interpolation
 */
export type I18nCronError = {
	key: string;
	values?: Record<string, string | number>;
};
