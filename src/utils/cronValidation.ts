export const WHITESPACE_REGEX = /\s+/;

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
		if (field.startsWith("-")) {
			const num = Number(field);
			if (Number.isNaN(num)) {
				return false;
			}
			if (max === 7 && num === 7) {
				return true;
			}
			return num >= min && num <= max;
		}

		const parts = field.split("-");
		if (parts.length !== 2) {
			return false;
		}

		const [start, end] = parts;
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
			const trimmedValue = value.trim();
			if (trimmedValue === "") {
				return false;
			}
			const num = Number(trimmedValue);
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
