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
});
