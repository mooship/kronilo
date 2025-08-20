import { describe, expect, it } from "bun:test";
import {
	calculateNextRuns,
	detectAmbiguousSchedule,
} from "../utils/cronScheduleCalculator";

const ambiguousCrons = ["0 0 1 1 1", "* * 15 * 2"];
const nonAmbiguousCrons = ["* * * * *", "0 0 * * 0", "0 0 1 * *"];

describe("detectAmbiguousSchedule", () => {
	it("returns true for ambiguous schedules", () => {
		for (const cron of ambiguousCrons) {
			expect(detectAmbiguousSchedule(cron)).toBe(true);
		}
	});

	it("returns false for non-ambiguous schedules", () => {
		for (const cron of nonAmbiguousCrons) {
			expect(detectAmbiguousSchedule(cron)).toBe(false);
		}
	});
});

const validCron = "*/5 * * * *";
const invalidCron = "* * *";
const ambiguousCron = "0 0 1 1 1";
const lang = "en-US";

describe("calculateNextRuns", () => {
	it("returns next runs for a valid cron", async () => {
		const result = await calculateNextRuns(validCron, lang);
		expect(result.runs.length).toBeGreaterThan(0);
		expect(result.error).toBeNull();
		expect(result.hasAmbiguousSchedule).toBe(false);
	});

	it("returns error for an invalid cron", async () => {
		const result = await calculateNextRuns(invalidCron, lang);
		expect(result.runs.length).toBe(0);
		expect(result.error).not.toBeNull();
		expect(result.hasAmbiguousSchedule).toBe(false);
	});

	it("detects ambiguous schedule", async () => {
		const result = await calculateNextRuns(ambiguousCron, lang);
		expect(result.hasAmbiguousSchedule).toBe(true);
	});

	it("returns error for Feb 31st (invalid date)", async () => {
		const result = await calculateNextRuns("0 0 31 2 *", lang);
		expect(result.runs.length).toBe(0);
		expect(result.error).not.toBeNull();
	});

	it("returns next runs for Feb 29th in a leap year", async () => {
		const result = await calculateNextRuns("0 0 29 2 *", lang);
		expect(result.runs.length).toBeGreaterThan(0);
		expect(result.error).toBeNull();
	});

	it("returns error for step value zero", async () => {
		const result = await calculateNextRuns("*/0 * * * *", lang);
		expect(result.runs.length).toBe(0);
		expect(result.error).not.toBeNull();
	});

	it("returns next runs for far future year", async () => {
		const result = await calculateNextRuns("0 0 1 1 2099", lang);
		expect(Array.isArray(result.runs)).toBe(true);
	});
	it("returns next runs for valid cron with list", async () => {
		const result = await calculateNextRuns("1,2,3 * * * *", lang);
		expect(result.runs.length).toBeGreaterThan(0);
		expect(result.error).toBeNull();
	});

	it("returns next runs for valid cron with range", async () => {
		const result = await calculateNextRuns("1-5 * * * *", lang);
		expect(result.runs.length).toBeGreaterThan(0);
		expect(result.error).toBeNull();
	});

	it("returns error for invalid cron with negative step", async () => {
		const result = await calculateNextRuns("*/-1 * * * *", lang);
		expect(result.runs.length).toBe(0);
		expect(result.error).not.toBeNull();
	});

	it("returns error for invalid cron with too many fields", async () => {
		const result = await calculateNextRuns("* * * * * *", lang);
		expect(result.runs.length).toBe(0);
		expect(result.error).not.toBeNull();
	});

	it("returns next runs for all fields set to max values", async () => {
		const result = await calculateNextRuns("59 23 31 12 7", lang);
		expect(Array.isArray(result.runs)).toBe(true);
		expect(result.error).toBeNull();
	});

	it("returns next runs for all fields set to min values", async () => {
		const result = await calculateNextRuns("0 0 1 1 0", lang);
		expect(Array.isArray(result.runs)).toBe(true);
		expect(result.error).toBeNull();
	});
});
