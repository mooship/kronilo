import { cronSchema, getCronValidationErrors } from "../schemas/cron";

// For compatibility with code/tests that import WHITESPACE_REGEX from here
export const WHITESPACE_REGEX = /\s+/;

export function isValidCronFormat(cron: string): boolean {
	if (!cron || typeof cron !== "string") {
		return false;
	}
	const result = cronSchema.safeParse(cron);
	return result.success;
}

export function getCronErrors(cron: string): string[] {
	return getCronValidationErrors(cron);
}
