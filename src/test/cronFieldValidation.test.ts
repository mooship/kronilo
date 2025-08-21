// Unit tests for cron field validation helpers.
// These tests exercise the pure validation functions exported from
// `src/schemas/cron.ts` and ensure the exported types are present and
// behave as expected. They intentionally avoid external systems and focus
// on deterministic, fast checks for validator correctness and error
// reason mapping.
import { describe, expect, it } from "bun:test";
import type { CronCalculationResult, CronTuple } from "../schemas/cron";
import { validateCronField, validateCronFieldDetailed } from "../schemas/cron";

describe("validateCronField (pure)", () => {
	it("accepts * when allowed", () => {
		expect(validateCronField("*", 0, 59, true)).toBe(true);
	});

	it("rejects invalid chars", () => {
		expect(validateCronField("$", 0, 59, true)).toBe(false);
	});

	it("validates ranges and steps", () => {
		expect(validateCronField("1-5", 0, 59)).toBe(true);
		expect(validateCronField("5-1", 0, 59)).toBe(false);
		expect(validateCronField("*/0", 0, 59)).toBe(false);
	});

	it("validates lists", () => {
		expect(validateCronField("1,2,3", 0, 59)).toBe(true);
		expect(validateCronField("1,99", 0, 59)).toBe(false);
	});
});

describe("validateCronFieldDetailed reasons", () => {
	it("returns invalidStep for zero step", () => {
		const res = validateCronFieldDetailed("*/0", 0, 59);
		expect(res.valid).toBe(false);
		if (!res.valid) expect(res.reason).toBe("invalidStep");
	});

	it("returns rangeStartGreater for reversed ranges", () => {
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
	it("tuple example works", () => {
		expect(Array.isArray(_tupleExample)).toBe(true);
	});
	it("calc example works", () => {
		expect(_calcExample.runs.length).toBeGreaterThan(0);
	});
});
