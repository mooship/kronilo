import { cronSchema, getCronValidationErrors } from "../schemas/cron";

/**
 * Regex for splitting cron expressions by whitespace.
 */
export const WHITESPACE_REGEX = /\s+/;

/**
 * Regex for splitting cron expressions by whitespace.
 */

/**
 * Check if a string is a valid cron expression using the cron schema.
 *
 * @param cron The cron expression to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidCronFormat(cron: string): boolean {
	if (!cron || typeof cron !== "string") {
		return false;
	}
	const result = cronSchema.safeParse(cron);
	return result.success;
}

/**
 * Get validation errors for a cron expression.
 *
 * @param cron The cron expression to check
 * @returns {I18nCronError[]} Array of error objects (empty if valid)
 */
import type { I18nCronError } from "../types/i18n";
export function getCronErrors(cron: string): I18nCronError[] {
	return getCronValidationErrors(cron);
}
