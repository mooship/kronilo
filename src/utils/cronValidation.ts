/**
 * Regular expression for matching whitespace characters in cron expressions.
 * Used to split cron strings into their component fields.
 */
export const WHITESPACE_REGEX = /\s+/;

/**
 * Validates if a string is a properly formatted cron expression.
 * Checks for exactly 5 space-separated fields and validates each field's format and range.
 *
 * @param cron - The cron expression string to validate
 * @returns True if the cron expression is valid, false otherwise
 *
 * @example
 * ```typescript
 * isValidCronFormat("0 9 * * 1-5"); // true
 * isValidCronFormat("invalid");      // false
 * ```
 */
export function isValidCronFormat(cron: string): boolean {
	if (!cron || typeof cron !== "string") {
		return false;
	}

	const parts = cron.trim().split(WHITESPACE_REGEX);

	if (parts.length !== 5) {
		return false;
	}

	const [minute, hour, day, month, weekday] = parts;

	return (
		isValidCronField(minute, 0, 59) &&
		isValidCronField(hour, 0, 23) &&
		isValidCronField(day, 1, 31) &&
		isValidCronField(month, 1, 12) &&
		isValidCronField(weekday, 0, 7)
	);
}

/**
 * Validates a single cron field against its allowed range and format.
 * Supports wildcards (\*), ranges (1-5), lists (1,3,5), and step values (\*\/5).
 *
 * @param field - The cron field to validate
 * @param min - Minimum allowed value for this field
 * @param max - Maximum allowed value for this field
 * @returns True if the field is valid for the given range
 */
function isValidCronField(field: string, min: number, max: number): boolean {
	if (field === "*") {
		return true;
	}

	if (field.includes("/")) {
		const [range, step] = field.split("/");
		if (!step || Number.isNaN(Number(step)) || Number(step) <= 0) {
			return false;
		}
		if (range === "*") {
			return true;
		}
		return isValidCronField(range, min, max);
	}

	if (field.includes("-")) {
		const [start, end] = field.split("-");
		const startNum = Number(start);
		const endNum = Number(end);

		if (Number.isNaN(startNum) || Number.isNaN(endNum)) {
			return false;
		}

		return (
			startNum >= min &&
			startNum <= max &&
			endNum >= min &&
			endNum <= max &&
			startNum <= endNum
		);
	}

	if (field.includes(",")) {
		const values = field.split(",");
		return values.every((value) => {
			const num = Number(value.trim());
			return !Number.isNaN(num) && num >= min && num <= max;
		});
	}

	const num = Number(field);
	if (Number.isNaN(num)) {
		return false;
	}

	if (max === 7 && num === 7) {
		return true;
	}

	return num >= min && num <= max;
}

/**
 * Predefined cron expression suggestions with human-readable descriptions.
 * Used for providing autocomplete/suggestion functionality in the UI.
 */
export const CRON_SUGGESTIONS = [
	{ expression: "*/5 * * * *", description: "Every 5 minutes" },
	{ expression: "0 * * * *", description: "Every hour" },
	{ expression: "0 0 * * *", description: "Every day at midnight" },
	{ expression: "0 9 * * 1-5", description: "Every weekday at 9 AM" },
	{ expression: "0 0 1 * *", description: "First day of every month" },
	{ expression: "0 0 * * 0", description: "Every Sunday at midnight" },
] as const;
