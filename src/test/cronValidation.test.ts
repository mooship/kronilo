/**
 * Unit tests for cron validation utilities.
 *
 * These tests verify field-level and expression-level validation, including
 * formats, ranges, steps, lists, and date edge cases. All tests focus on pure
 * functions and avoid external systems to remain fast and deterministic.
 */
import { describe, expect, it } from "bun:test";
import { getCronValidationErrors } from "../schemas/cron";
import { getCronErrors, isValidCronFormat } from "../utils/cronValidation";

const validCrons = [
	"* * * * *",
	"0 0 * * 0",
	"*/5 * * * *",
	"9 * * * 1-5",
	"0 1 * * *",
	"0 0 * * 7",
];

const invalidCrons = [
	"* * * *",
	"* * * * * *",
	"a b c d e",
	"60 24 32 13 8",
	"* * * * $",
	"0 0 0 0 0",
];

describe("isValidCronFormat", () => {
	it("returns true for valid cron expressions (basic format check)", () => {
		for (const cron of validCrons) {
			expect(isValidCronFormat(cron)).toBe(true);
		}
	});

	it("returns false for invalid cron expressions (basic format check)", () => {
		for (const cron of invalidCrons) {
			expect(isValidCronFormat(cron)).toBe(false);
		}
	});
});

describe("getCronErrors", () => {
	it("returns no errors for valid cron expressions (should be empty)", () => {
		for (const cron of validCrons) {
			expect(getCronErrors(cron)).toEqual([]);
		}
	});

	it("returns errors for invalid cron expressions (should be non-empty)", () => {
		for (const cron of invalidCrons) {
			expect(getCronErrors(cron).length).toBeGreaterThan(0);
		}
	});
});

describe("getCronValidationErrors", () => {
	it("returns error for empty string (no expression)", () => {
		expect(getCronValidationErrors("")).toEqual([
			{ key: "cron.errors.noExpression" },
		]);
	});

	it("returns error for too few fields (not enough fields)", () => {
		expect(getCronValidationErrors("* * * *")[0].key).toBe(
			"cron.errors.invalidFieldCount",
		);
	});

	it("returns error for invalid characters (non-numeric or special)", () => {
		expect(getCronValidationErrors("* * * * $")[0].key).toBe(
			"cron.errors.invalidCharacters",
		);
	});

	it("returns error for out of range values (numeric bounds)", () => {
		expect(getCronValidationErrors("60 24 32 13 8")[0].key).toBe(
			"cron.errors.valueOutOfRange",
		);
	});

	it("returns error for Feb 31st (invalid calendar date)", () => {
		const errors = getCronValidationErrors("0 0 31 2 *");
		expect(errors.length).toBeGreaterThan(0);
		expect(errors[0].key).toBe("cron.errors.invalidField");
	});

	it("returns error for step value zero", () => {
		const errors = getCronValidationErrors("*/0 * * * *");
		expect(errors.length).toBeGreaterThan(0);
		expect(errors[0].key).toBe("cron.errors.invalidStep");
	});

	it("returns error for extra whitespace", () => {
		expect(getCronValidationErrors("  * * * * *  ")).toEqual([]);
	});

	it("returns error for invalid list values", () => {
		const errors = getCronValidationErrors("1,2,99 * * * *");
		expect(errors.length).toBeGreaterThan(0);
		expect(errors[0].key).toBe("cron.errors.invalidValues");
	});

	it("returns error for invalid range values", () => {
		const errors = getCronValidationErrors("1-100 * * * *");
		expect(errors.length).toBeGreaterThan(0);
		expect(errors[0].key).toBe("cron.errors.valueOutOfRange");
	});
	it("returns a single error for multiple issues", () => {
		const errors = getCronValidationErrors("a b c d");
		expect(errors.length).toBe(1);
	});

	it("deduplicates identical errors across multiple fields", () => {
		const errors = getCronValidationErrors("1 1 a a a");
		expect(errors.length).toBe(1);
		expect(errors[0].key).toBe("cron.errors.invalidCharacters");
		expect(errors[0].values?.field).toBe("a");
	});

	it("deduplicates identical invalid character errors across all fields", () => {
		const errors = getCronValidationErrors("$ $ $ $ $");
		expect(errors.length).toBe(1);
		expect(errors[0].key).toBe("cron.errors.invalidCharacters");
		expect(errors[0].values?.field).toBe("$");
	});

	it("does not deduplicate different out-of-range values", () => {
		const errors = getCronValidationErrors("100 200 300 400 500");
		expect(errors.length).toBe(5);

		const valueOutOfRangeErrors = errors.filter(
			(error) => error.key === "cron.errors.valueOutOfRange",
		);
		const dayOfWeekErrors = errors.filter(
			(error) => error.key === "cron.errors.dayOfWeekRange",
		);

		expect(valueOutOfRangeErrors.length).toBe(4);
		expect(dayOfWeekErrors.length).toBe(1);
	});

	it("returns error for negative step value", () => {
		const errors = getCronValidationErrors("*/-1 * * * *");
		expect(errors.length).toBeGreaterThan(0);
		expect(errors[0].key).toBe("cron.errors.invalidStep");
	});

	it("returns error for too many fields", () => {
		const errors = getCronValidationErrors("* * * * * *");
		expect(errors[0].key).toBe("cron.errors.invalidFieldCount");
	});

	it("returns error for invalid list with out-of-range value", () => {
		const errors = getCronValidationErrors("1,2,100 * * * *");
		expect(errors.length).toBeGreaterThan(0);
		expect(errors[0].key).toBe("cron.errors.invalidValues");
	});

	it("returns no error for valid cron with extra whitespace between fields", () => {
		expect(getCronValidationErrors(" 0   0  *  *  * ")).toEqual([]);
	});

	it("returns error for invalid range (start > end)", () => {
		const errors = getCronValidationErrors("5-1 * * * *");
		expect(errors.length).toBeGreaterThan(0);
		expect(errors[0].key).toBe("cron.errors.rangeStartGreater");
	});

	it("returns error for all fields set to max values", () => {
		const errors = getCronValidationErrors("59 23 31 12 7");
		expect(errors.length).toBe(0);
	});

	it("returns error for all fields set to min values", () => {
		const errors = getCronValidationErrors("0 0 1 1 0");
		expect(errors.length).toBe(0);
	});
});
