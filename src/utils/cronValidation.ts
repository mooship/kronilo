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
 * @returns {string[]} Array of error messages (empty if valid)
 */
export function getCronErrors(cron: string): string[] {
	return getCronValidationErrors(cron);
}
