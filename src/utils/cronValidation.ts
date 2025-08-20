import { CRON_FIELD_SCHEMAS, getCronValidationErrors } from "../schemas/cron";
import type { I18nCronError } from "../types/i18n";

/**
 * WHITESPACE_REGEX
 *
 * Regex used when splitting cron expressions into fields.
 */
export const WHITESPACE_REGEX = /\s+/;

/**
 * isValidCronFormat
 *
 * Lightweight structural validation for cron expressions. It ensures there are
 * exactly five space-separated fields and that each field matches the
 * corresponding field schema from `CRON_FIELD_SCHEMAS`.
 *
 * @param cron - cron expression string
 * @returns boolean indicating whether the format is valid
 */
export function isValidCronFormat(cron: string): boolean {
	if (!cron || typeof cron !== "string") {
		return false;
	}

	const fields = cron.trim().split(WHITESPACE_REGEX);
	if (fields.length !== 5) {
		return false;
	}

	for (let i = 0; i < fields.length; i++) {
		const result = CRON_FIELD_SCHEMAS[i].safeParse(fields[i]);
		if (!result.success) {
			return false;
		}
	}
	return true;
}

/**
 * getCronErrors
 *
 * Returns an array of i18n-friendly error objects for a cron expression.
 */
export function getCronErrors(cron: string): I18nCronError[] {
	return getCronValidationErrors(cron);
}
