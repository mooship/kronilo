const CRON_FIELD_INVALID_CHAR_REGEX = /[^\d\-,*/]/;
export const cronCalculationResultSchema = z.object({
	runs: z.array(z.string()),
	error: z.string().nullable(),
	hasAmbiguousSchedule: z.boolean(),
});

import type { ZodString } from "zod";
import { z } from "zod";

export function cronFieldSchema(
	min: number,
	max: number,
	allowAsterisk = true,
): ZodString {
	return z.string().refine(
		(field: string): boolean => {
			if (allowAsterisk && field === "*") {
				return true;
			}
			if (field.includes("/")) {
				const [range, step] = field.split("/");
				if (!step || Number.isNaN(Number(step)) || Number(step) <= 0)
					return false;
				if (range === "*" && allowAsterisk) {
					return true;
				}
				return cronFieldSchema(min, max, false).safeParse(range).success;
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
		},
		{
			message: `Invalid cron field value`,
		},
	);
}

export const CRON_FIELD_NAMES = [
	"minute",
	"hour",
	"day of month",
	"month",
	"day of week",
];

export const CRON_FIELD_RANGES = [
	"0-59",
	"0-23",
	"1-31",
	"1-12",
	"0-7 (0 or 7 = Sunday)",
];

export const CRON_FIELD_SCHEMAS = [
	cronFieldSchema(0, 59),
	cronFieldSchema(0, 23),
	cronFieldSchema(1, 31),
	cronFieldSchema(1, 12),
	cronFieldSchema(0, 7),
];

export function getCronValidationErrors(
	cron: string,
): { key: string; values?: Record<string, string | number> }[] {
	if (!cron || typeof cron !== "string") {
		return [{ key: "cron.errors.noExpression" }];
	}
	const fields = cron.trim().split(/\s+/);
	if (fields.length !== 5) {
		return [
			{
				key: "cron.errors.invalidFieldCount",
				values: { count: fields.length },
			},
		];
	}
	const errors: { key: string; values?: Record<string, string | number> }[] =
		[];
	fields.forEach((field, i) => {
		const result = CRON_FIELD_SCHEMAS[i].safeParse(field);
		if (!result.success) {
			let key = "cron.errors.invalidField";
			let values: Record<string, string | number> = {
				field: field,
				fieldName: CRON_FIELD_NAMES[i],
				fieldRange: CRON_FIELD_RANGES[i],
			};
			if (field === "") {
				key = "cron.errors.missingValue";
			} else if (CRON_FIELD_INVALID_CHAR_REGEX.test(field)) {
				key = "cron.errors.invalidCharacters";
			} else if (field.includes("/")) {
				const step = field.split("/")[1];
				if (!step || Number.isNaN(Number(step)) || Number(step) <= 0) {
					key = "cron.errors.invalidStep";
				}
			} else if (field.includes("-")) {
				const parts = field.split("-");
				if (parts.length !== 2) {
					key = "cron.errors.invalidRangeFormat";
				} else {
					const [start, end] = parts;
					if (Number(start) > Number(end)) {
						key = "cron.errors.rangeStartGreater";
						values = { ...values, start, end };
					} else if (i === 4) {
						key = "cron.errors.dayOfWeekRange";
					}
				}
			} else if (field.includes(",")) {
				const valuesArr = field.split(",");
				const invalids = valuesArr.filter((v) => {
					const trimmed = v.trim();
					const num = Number(trimmed);
					return (
						trimmed &&
						(Number.isNaN(num) ||
							num < Number(CRON_FIELD_RANGES[i].split("-")[0]) ||
							num > Number(CRON_FIELD_RANGES[i].split("-")[1]))
					);
				});
				if (invalids.length > 0) {
					if (i === 4) {
						key = "cron.errors.invalidDayOfWeekValues";
						values = { ...values, invalids: invalids.join(", ") };
					} else {
						key = "cron.errors.invalidValues";
						values = { ...values, invalids: invalids.join(", ") };
					}
				}
			} else if (!Number.isNaN(Number(field))) {
				const num = Number(field);
				const [min, max] = CRON_FIELD_RANGES[i].split("-").map(Number);
				if (num < min || num > max || (i === 2 && num === 0)) {
					if (i === 4) {
						key = "cron.errors.dayOfWeekRange";
					} else {
						key = "cron.errors.valueOutOfRange";
						values = { ...values, num };
					}
				}
			}
			if (i === 4 && key === "cron.errors.invalidField") {
				key = "cron.errors.dayOfWeekRange";
			}
			errors.push({ key, values });
		}
	});

	const dayField = fields[2];
	const monthField = fields[3];
	if (
		!CRON_FIELD_INVALID_CHAR_REGEX.test(dayField) &&
		!CRON_FIELD_INVALID_CHAR_REGEX.test(monthField)
	) {
		const day = Number(dayField);
		const month = Number(monthField);
		if (!Number.isNaN(day) && !Number.isNaN(month)) {
			const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
			if (month >= 1 && month <= 12) {
				let maxDay = daysInMonth[month - 1];
				if (month === 2 && day === 29) {
					maxDay = 29;
				}
				if (day > maxDay) {
					errors.push({
						key: "cron.errors.invalidField",
						values: { day, month },
					});
				}
			}
		}
	}
	return errors;
}

const CRON_SCHEMA_TUPLE = z.tuple([
	cronFieldSchema(0, 59),
	cronFieldSchema(0, 23),
	cronFieldSchema(1, 31),
	cronFieldSchema(1, 12),
	cronFieldSchema(0, 7),
]);

export const cronSchema = z
	.string()
	.trim()
	.refine((val) => val.split(/\s+/).length === 5, {
		message: "Cron expression must have 5 fields",
	})
	.transform((val) => val.split(/\s+/))
	.pipe(CRON_SCHEMA_TUPLE);
