import { type ZodString, z } from "zod";

const CRON_FIELD_INVALID_CHAR_REGEX = /[^\d,*\u002F-]/;

export const CRON_FIELD_RANGES = [
	"0-59",
	"0-23",
	"1-31",
	"1-12",
	"0-7 (0 or 7 = Sunday)",
];

export const CRON_FIELD_MIN_MAX: [number, number][] = [
	[0, 59],
	[0, 23],
	[1, 31],
	[1, 12],
	[0, 7],
];

export const cronCalculationResultSchema = z.object({
	runs: z.array(z.string()),
	error: z.string().nullable(),
	hasAmbiguousSchedule: z.boolean(),
});

export function cronFieldSchema(
	min: number,
	max: number,
	allowAsterisk = true,
): ZodString {
	return z.string().superRefine((field: string, ctx) => {
		const res = validateCronFieldDetailed(field, min, max, allowAsterisk);
		if (!res.valid) {
			ctx.addIssue({ code: z.ZodIssueCode.custom, message: res.reason });
		}
	});
}

export function validateCronField(
	field: string,
	min: number,
	max: number,
	allowAsterisk = true,
): boolean {
	return validateCronFieldDetailed(field, min, max, allowAsterisk).valid;
}

export function validateCronFieldDetailed(
	field: string,
	min: number,
	max: number,
	allowAsterisk = true,
):
	| { valid: true }
	| {
			valid: false;
			reason: string;
			details?: Record<string, string | number | string[]>;
	  } {
	if (!field || field === "") {
		return { valid: false, reason: "missingValue" };
	}
	if (allowAsterisk && field === "*") {
		return { valid: true };
	}
	if (CRON_FIELD_INVALID_CHAR_REGEX.test(field))
		return { valid: false, reason: "invalidCharacters" };

	if (field.includes("/")) {
		const [range, step] = field.split("/");
		if (!step || Number.isNaN(Number(step)) || Number(step) <= 0) {
			return { valid: false, reason: "invalidStep" };
		}
		if (range === "*" && allowAsterisk) {
			return { valid: true };
		}
		const sub = validateCronFieldDetailed(range, min, max, false);
		return sub.valid ? { valid: true } : sub;
	}

	if (field.includes("-")) {
		if (field.startsWith("-")) {
			const num = Number(field);
			if (Number.isNaN(num)) {
				return { valid: false, reason: "invalidField" };
			}
			if (max === 7 && num === 7) {
				return { valid: true };
			}
			return num >= min && num <= max
				? { valid: true }
				: { valid: false, reason: "valueOutOfRange", details: { num } };
		}
		const parts = field.split("-");
		if (parts.length !== 2) {
			return { valid: false, reason: "invalidRangeFormat" };
		}
		const [start, end] = parts;
		const startNum = Number(start);
		const endNum = Number(end);
		if (Number.isNaN(startNum) || Number.isNaN(endNum)) {
			return { valid: false, reason: "invalidRangeFormat" };
		}
		if (startNum > endNum)
			return {
				valid: false,
				reason: "rangeStartGreater",
				details: { start: startNum, end: endNum },
			};
		if (startNum < min || endNum > max)
			return {
				valid: false,
				reason: "valueOutOfRange",
				details: { start: startNum, end: endNum },
			};
		return { valid: true };
	}

	if (field.includes(",")) {
		const values = field.split(",");
		const invalids: string[] = [];
		for (const v of values) {
			const trimmed = v.trim();
			if (trimmed === "") {
				invalids.push(v);
				continue;
			}
			const num = Number(trimmed);
			if (Number.isNaN(num) || num < min || num > max) {
				invalids.push(trimmed);
			}
		}
		if (invalids.length > 0) {
			return { valid: false, reason: "invalidValues", details: { invalids } };
		}
		return { valid: true };
	}

	const num = Number(field);
	if (Number.isNaN(num)) {
		return { valid: false, reason: "invalidField" };
	}
	if (max === 7 && num === 7) {
		return { valid: true };
	}
	if (num < min || num > max || (min === 1 && num === 0)) {
		return { valid: false, reason: "valueOutOfRange", details: { num } };
	}
	return { valid: true };
}

export type CronTuple = z.infer<typeof CRON_SCHEMA_TUPLE>;
export type CronCalculationResult = z.infer<typeof cronCalculationResultSchema>;

export const CRON_FIELD_NAMES = [
	"minute",
	"hour",
	"day of month",
	"month",
	"day of week",
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

	const fieldErrors: Array<{
		fieldIndex: number;
		key: string;
		values: Record<string, string | number>;
		reason: string;
	}> = [];

	fields.forEach((field, i) => {
		const detailed = validateCronFieldDetailed(
			field,
			CRON_FIELD_MIN_MAX[i][0],
			CRON_FIELD_MIN_MAX[i][1],
			true,
		);
		if (!detailed.valid) {
			let key = "cron.errors.invalidField";
			let values: Record<string, string | number> = {
				field: field,
				fieldName: CRON_FIELD_NAMES[i],
				fieldRange: CRON_FIELD_RANGES[i],
			};
			switch (detailed.reason) {
				case "missingValue":
					key = "cron.errors.missingValue";
					break;
				case "invalidCharacters":
					key = "cron.errors.invalidCharacters";
					break;
				case "invalidStep":
					key = "cron.errors.invalidStep";
					break;
				case "invalidRangeFormat":
					key = "cron.errors.invalidRangeFormat";
					break;
				case "rangeStartGreater":
					key = "cron.errors.rangeStartGreater";
					values = {
						...values,
						...(detailed.details as Record<string, string | number>),
					};
					break;
				case "invalidValues":
					if (i === 4) {
						key = "cron.errors.invalidDayOfWeekValues";
					} else {
						key = "cron.errors.invalidValues";
					}
					{
						const invalidsRaw = detailed.details?.invalids;
						if (Array.isArray(invalidsRaw)) {
							values = {
								...values,
								invalids: (invalidsRaw as string[]).join(", "),
							};
						} else {
							values = { ...values, invalids: String(invalidsRaw ?? "") };
						}
					}
					break;
				case "valueOutOfRange":
					if (i === 4) {
						key = "cron.errors.dayOfWeekRange";
					} else {
						key = "cron.errors.valueOutOfRange";
						values = {
							...values,
							...(detailed.details as Record<string, string | number>),
						};
					}
					break;
				default:
					key = "cron.errors.invalidField";
			}
			fieldErrors.push({ fieldIndex: i, key, values, reason: detailed.reason });
		}
	});

	const errors: { key: string; values?: Record<string, string | number> }[] =
		[];
	const uniqueErrors = new Map<
		string,
		{ key: string; values?: Record<string, string | number> }
	>();

	for (const error of fieldErrors) {
		let errorKey: string;

		if (
			error.reason === "invalidCharacters" ||
			error.reason === "missingValue" ||
			error.reason === "invalidStep" ||
			error.reason === "invalidRangeFormat"
		) {
			errorKey = error.key;
		} else {
			const {
				fieldName: _fieldName,
				fieldRange: _fieldRange,
				...coreValues
			} = error.values;
			errorKey = error.key + JSON.stringify(coreValues);
		}

		if (!uniqueErrors.has(errorKey)) {
			uniqueErrors.set(errorKey, { key: error.key, values: error.values });
		}
	}

	for (const error of uniqueErrors.values()) {
		errors.push(error);
	}

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
