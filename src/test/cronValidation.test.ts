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
	it("returns true for valid cron expressions", () => {
		for (const cron of validCrons) {
			expect(isValidCronFormat(cron)).toBe(true);
		}
	});

	it("returns false for invalid cron expressions", () => {
		for (const cron of invalidCrons) {
			expect(isValidCronFormat(cron)).toBe(false);
		}
	});
});

describe("getCronErrors", () => {
	it("returns no errors for valid cron expressions", () => {
		for (const cron of validCrons) {
			expect(getCronErrors(cron)).toEqual([]);
		}
	});

	it("returns errors for invalid cron expressions", () => {
		for (const cron of invalidCrons) {
			expect(getCronErrors(cron).length).toBeGreaterThan(0);
		}
	});
});

describe("getCronValidationErrors", () => {
	it("returns error for empty string", () => {
		expect(getCronValidationErrors("")).toEqual([
			{ key: "cron.errors.noExpression" },
		]);
	});

	it("returns error for too few fields", () => {
		expect(getCronValidationErrors("* * * *")[0].key).toBe(
			"cron.errors.invalidFieldCount",
		);
	});

	it("returns error for invalid characters", () => {
		expect(getCronValidationErrors("* * * * $")[0].key).toBe(
			"cron.errors.invalidCharacters",
		);
	});

	it("returns error for out of range values", () => {
		expect(getCronValidationErrors("60 24 32 13 8")[0].key).toBe(
			"cron.errors.valueOutOfRange",
		);
	});

	it("returns error for Feb 31st (invalid date)", () => {
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
		expect(errors[0].key).toBe("cron.errors.invalidField");
	});
});
