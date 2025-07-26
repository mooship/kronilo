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

export function getCronValidationErrors(cron: string): string[] {
	if (!cron || typeof cron !== "string") {
		return [
			"No cron expression provided. Please enter a cron schedule like '0 12 * * 1'.",
		];
	}
	const fields = cron.trim().split(/\s+/);
	if (fields.length !== 5) {
		return [
			`A cron expression must have 5 fields (minute hour day month weekday), but got ${fields.length}. Example: '0 12 * * 1'`,
		];
	}
	const errors: string[] = [];
	fields.forEach((field, i) => {
		const result = CRON_FIELD_SCHEMAS[i].safeParse(field);
		if (!result.success) {
			let msg = result.error.issues[0]?.message || "Invalid value.";
			if (field === "") {
				msg = `Missing value. Please provide a value for the ${CRON_FIELD_NAMES[i]} field (${CRON_FIELD_RANGES[i]}).`;
			} else if (/[^\d\-,*/]/.test(field)) {
				msg = `Contains invalid characters. Only numbers, ',', '-', '*', and '/' are allowed.`;
			} else if (field.includes("/")) {
				const step = field.split("/")[1];
				if (!step || Number.isNaN(Number(step)) || Number(step) <= 0) {
					msg = `Step value after '/' must be a positive integer.`;
				}
			} else if (field.includes("-")) {
				const parts = field.split("-");
				if (parts.length !== 2) {
					msg = `Range must be in the form 'start-end', e.g. 1-5.`;
				} else {
					const [start, end] = parts;
					if (Number(start) > Number(end)) {
						msg = `Range start (${start}) should not be greater than end (${end}).`;
					}
				}
			} else if (field.includes(",")) {
				const values = field.split(",");
				const invalids = values.filter((v) => {
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
					msg = `Invalid value(s): ${invalids.join(", ")}. Allowed range: ${CRON_FIELD_RANGES[i]}.`;
				}
			} else if (!Number.isNaN(Number(field))) {
				const num = Number(field);
				const [min, max] = CRON_FIELD_RANGES[i].split("-").map(Number);
				if (num < min || num > max || (i === 2 && num === 0)) {
					msg = `Value ${num} is out of range for ${CRON_FIELD_NAMES[i]} (${CRON_FIELD_RANGES[i]}).`;
				}
			}
			errors.push(`Invalid ${CRON_FIELD_NAMES[i]}: "${field}". ${msg}`);
		}
	});
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
