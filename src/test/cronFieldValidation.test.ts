import { describe, expect, it } from "bun:test";
import type { CronCalculationResult, CronTuple } from "../schemas/cron";
import { validateCronField, validateCronFieldDetailed } from "../schemas/cron";

describe("validateCronField (pure)", () => {
	it("accepts '*' when allowed as a wildcard", () => {
		expect(validateCronField("*", 0, 59, true)).toBe(true);
	});

	it("rejects invalid characters in field", () => {
		expect(validateCronField("$", 0, 59, true)).toBe(false);
	});

	it("validates numeric ranges and step values", () => {
		expect(validateCronField("1-5", 0, 59)).toBe(true);
		expect(validateCronField("5-1", 0, 59)).toBe(false);
		expect(validateCronField("*/0", 0, 59)).toBe(false);
	});

	it("validates comma-separated lists of values", () => {
		expect(validateCronField("1,2,3", 0, 59)).toBe(true);
		expect(validateCronField("1,99", 0, 59)).toBe(false);
	});
});

describe("validateCronFieldDetailed reasons", () => {
	it("returns 'invalidStep' reason for zero step", () => {
		const res = validateCronFieldDetailed("*/0", 0, 59);
		expect(res.valid).toBe(false);
		if (!res.valid) expect(res.reason).toBe("invalidStep");
	});

	it("returns 'rangeStartGreater' reason for reversed ranges", () => {
		const res = validateCronFieldDetailed("5-1", 0, 59);
		expect(res.valid).toBe(false);
		if (!res.valid) {
			expect(res.reason).toBe("rangeStartGreater");
		}
	});
});

const _tupleExample: CronTuple = ["0", "0", "1", "1", "0"];
const _calcExample: CronCalculationResult = {
	runs: ["now"],
	error: null,
	hasAmbiguousSchedule: false,
};

describe("exported types smoke", () => {
	it("CronTuple type is an array of strings", () => {
		expect(Array.isArray(_tupleExample)).toBe(true);
	});
	it("CronCalculationResult type has expected structure", () => {
		expect(_calcExample.runs.length).toBeGreaterThan(0);
	});
});
