import { isEmpty } from "radash";
import { CRON_FIELD_SCHEMAS, getCronValidationErrors } from "../schemas/cron";
import type { I18nCronError } from "../types/i18n";

export const WHITESPACE_REGEX = /\s+/;

export function isValidCronFormat(cron: string): boolean {
	if (!cron || typeof cron !== "string") {
		return false;
	}

	const fields = cron.trim().split(WHITESPACE_REGEX);
	if (fields.length !== 5) {
		return false;
	}

	for (const [i, field] of fields.entries()) {
		const result = CRON_FIELD_SCHEMAS[i].safeParse(field);
		if (!result.success) {
			return false;
		}
	}
	return true;
}

export function getCronErrors(cron: string): I18nCronError[] {
	const errors = getCronValidationErrors(cron);
	return isEmpty(errors) ? [] : errors;
}
