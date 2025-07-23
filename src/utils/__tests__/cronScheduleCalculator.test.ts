import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { CronCalculationResult } from "../../types";
import {
	calculateNextRuns,
	detectAmbiguousSchedule,
} from "../cronScheduleCalculator";

const mockParse = vi.fn();

vi.mock("cron-parser", () => ({
	default: {
		get parse() {
			return mockParse;
		},
	},
}));

describe("cronScheduleCalculator", () => {
	beforeEach(() => {
		mockParse.mockReset();

		mockParse.mockImplementation(
			(_cron: string, _options?: { tz?: string }) => {
				const mockDates = [
					new Date("2025-07-23T10:00:00Z"),
					new Date("2025-07-23T11:00:00Z"),
					new Date("2025-07-23T12:00:00Z"),
					new Date("2025-07-23T13:00:00Z"),
					new Date("2025-07-23T14:00:00Z"),
				];

				let index = 0;
				return {
					next: () => ({
						toDate: () => {
							if (index >= mockDates.length) {
								throw new Error("No more dates");
							}
							return mockDates[index++];
						},
					}),
				};
			},
		);
	});

	describe("detectAmbiguousSchedule", () => {
		describe("should return true for ambiguous schedules", () => {
			it("should detect when both day-of-month and day-of-week are specific values", () => {
				expect(detectAmbiguousSchedule("0 0 15 * 1")).toBe(true);
				expect(detectAmbiguousSchedule("30 14 1 6 5")).toBe(true);
				expect(detectAmbiguousSchedule("0 9 10 * 2")).toBe(true);
			});

			it("should handle extra whitespace", () => {
				expect(detectAmbiguousSchedule("  0   0   15   *   1  ")).toBe(true);
				expect(detectAmbiguousSchedule("0\t0\t15\t*\t1")).toBe(true);
			});
		});

		describe("should return false for non-ambiguous schedules", () => {
			it("should return false when day-of-month is wildcard", () => {
				expect(detectAmbiguousSchedule("0 0 * * 1")).toBe(false);
				expect(detectAmbiguousSchedule("30 14 * 6 5")).toBe(false);
			});

			it("should return false when day-of-week is wildcard", () => {
				expect(detectAmbiguousSchedule("0 0 15 * *")).toBe(false);
				expect(detectAmbiguousSchedule("30 14 1 6 *")).toBe(false);
			});

			it("should return false when both are wildcards", () => {
				expect(detectAmbiguousSchedule("0 0 * * *")).toBe(false);
				expect(detectAmbiguousSchedule("*/5 * * * *")).toBe(false);
			});

			it("should return false when day-of-month contains ranges", () => {
				expect(detectAmbiguousSchedule("0 0 1-15 * 1")).toBe(false);
				expect(detectAmbiguousSchedule("0 0 10-20 * 5")).toBe(false);
			});

			it("should return false when day-of-week contains ranges", () => {
				expect(detectAmbiguousSchedule("0 0 15 * 1-5")).toBe(false);
				expect(detectAmbiguousSchedule("0 0 10 * 0-6")).toBe(false);
			});

			it("should return false when day-of-month contains steps", () => {
				expect(detectAmbiguousSchedule("0 0 */2 * 1")).toBe(false);
				expect(detectAmbiguousSchedule("0 0 1-31/3 * 5")).toBe(false);
			});

			it("should return false when day-of-week contains steps", () => {
				expect(detectAmbiguousSchedule("0 0 15 * */2")).toBe(false);
				expect(detectAmbiguousSchedule("0 0 10 * 1-5/2")).toBe(false);
			});

			it("should return false when day-of-month contains lists", () => {
				expect(detectAmbiguousSchedule("0 0 1,15,30 * 1")).toBe(false);
				expect(detectAmbiguousSchedule("0 0 5,10,20 * 5")).toBe(false);
			});

			it("should return false when day-of-week contains lists", () => {
				expect(detectAmbiguousSchedule("0 0 15 * 1,3,5")).toBe(false);
				expect(detectAmbiguousSchedule("0 0 10 * 0,6")).toBe(false);
			});

			it("should return false for invalid cron expressions (too few parts)", () => {
				expect(detectAmbiguousSchedule("0 0 15")).toBe(false);
				expect(detectAmbiguousSchedule("* * *")).toBe(false);
				expect(detectAmbiguousSchedule("")).toBe(false);
			});
		});

		describe("edge cases", () => {
			it("should handle mixed complex expressions", () => {
				expect(detectAmbiguousSchedule("0 0 1-15 * 1,3,5")).toBe(false);
				expect(detectAmbiguousSchedule("0 0 */2 * 1-5")).toBe(false);
				expect(detectAmbiguousSchedule("0 0 1,15 * */2")).toBe(false);
			});

			it("should handle expressions with 6 parts (seconds)", () => {
				expect(detectAmbiguousSchedule("0 0 0 15 * 1")).toBe(false);
				expect(detectAmbiguousSchedule("0 0 0 * * 1")).toBe(false);
				expect(detectAmbiguousSchedule("0 0 15 * 1 *")).toBe(true);
			});
		});
	});

	describe("calculateNextRuns", () => {
		beforeAll(() => {
			vi.stubGlobal("Intl", {
				DateTimeFormat: () => ({
					resolvedOptions: () => ({ timeZone: "UTC" }),
				}),
			});
		});

		describe("successful calculations", () => {
			it("should return 5 next run times for a valid cron expression", async () => {
				const result = await calculateNextRuns("0 * * * *", "en-US");

				expect(result.error).toBeNull();
				expect(result.runs).toHaveLength(5);
				expect(result.hasAmbiguousSchedule).toBe(false);

				result.runs.forEach((run) => {
					expect(typeof run).toBe("string");
					expect(run.length).toBeGreaterThan(0);
				});
			});

			it("should detect ambiguous schedules in successful calculations", async () => {
				const result = await calculateNextRuns("0 0 15 * 1", "en-US");

				expect(result.error).toBeNull();
				expect(result.runs).toHaveLength(5);
				expect(result.hasAmbiguousSchedule).toBe(true);
			});

			it("should handle different locales", async () => {
				const resultEn = await calculateNextRuns("0 * * * *", "en-US");
				const resultFr = await calculateNextRuns("0 * * * *", "fr-FR");
				const resultDe = await calculateNextRuns("0 * * * *", "de-DE");

				expect(resultEn.error).toBeNull();
				expect(resultFr.error).toBeNull();
				expect(resultDe.error).toBeNull();

				expect(resultEn.runs).toHaveLength(5);
				expect(resultFr.runs).toHaveLength(5);
				expect(resultDe.runs).toHaveLength(5);
			});

			it("should handle non-ambiguous complex expressions", async () => {
				const complexExpressions = [
					"*/15 9-17 * * 1-5",
					"0 0 1 * *",
					"0 */2 * * *",
					"30 8,20 * * *",
				];

				for (const cron of complexExpressions) {
					const result = await calculateNextRuns(cron, "en-US");
					expect(result.error).toBeNull();
					expect(result.runs).toHaveLength(5);
				}
			});
		});

		describe("error handling", () => {
			it("should handle cron-parser import failure", async () => {
				mockParse.mockImplementation(() => {
					throw new Error("cron-parser not loaded");
				});

				const result = await calculateNextRuns("0 * * * *", "en-US");

				expect(result.error).toBe("cron-parser not loaded");
				expect(result.runs).toEqual([]);
				expect(result.hasAmbiguousSchedule).toBe(false);
			});

			it("should handle cron-parser parsing errors", async () => {
				mockParse.mockImplementation(() => {
					throw new Error("Invalid cron expression");
				});

				const result = await calculateNextRuns("invalid cron", "en-US");

				expect(result.error).toBe("Invalid cron expression");
				expect(result.runs).toEqual([]);
				expect(result.hasAmbiguousSchedule).toBe(false);
			});

			it("should handle non-Error exceptions", async () => {
				mockParse.mockImplementation(() => {
					throw "String error";
				});

				const result = await calculateNextRuns("0 * * * *", "en-US");

				expect(result.error).toBe("Invalid cron expression");
				expect(result.runs).toEqual([]);
				expect(result.hasAmbiguousSchedule).toBe(false);
			});
		});

		describe("type safety", () => {
			it("should return the correct CronCalculationResult type", async () => {
				const result: CronCalculationResult = await calculateNextRuns(
					"0 * * * *",
					"en-US",
				);

				expect(result).toHaveProperty("runs");
				expect(result).toHaveProperty("error");
				expect(result).toHaveProperty("hasAmbiguousSchedule");

				expect(Array.isArray(result.runs)).toBe(true);
				expect(typeof result.hasAmbiguousSchedule).toBe("boolean");
				expect(result.error === null || typeof result.error === "string").toBe(
					true,
				);
			});
		});

		describe("real-world scenarios", () => {
			it("should handle common cron expressions", async () => {
				const commonExpressions = [
					{ cron: "0 0 * * *", desc: "Daily at midnight", ambiguous: false },
					{ cron: "0 9 * * 1-5", desc: "Weekdays at 9 AM", ambiguous: false },
					{ cron: "*/5 * * * *", desc: "Every 5 minutes", ambiguous: false },
					{ cron: "0 0 1 * *", desc: "First day of month", ambiguous: false },
					{
						cron: "0 0 15 * 1",
						desc: "15th and Mondays (ambiguous)",
						ambiguous: true,
					},
					{ cron: "0 12 * * 0", desc: "Sundays at noon", ambiguous: false },
				];

				for (const { cron, desc, ambiguous } of commonExpressions) {
					const result = await calculateNextRuns(cron, "en-US");

					expect(result.error, `Failed for: ${desc}`).toBeNull();
					expect(result.runs, `Failed for: ${desc}`).toHaveLength(5);
					expect(result.hasAmbiguousSchedule, `Failed for: ${desc}`).toBe(
						ambiguous,
					);
				}
			});
		});
	});

	describe("integration tests", () => {
		it("should work together for complex scheduling scenarios", async () => {
			const testCases = [
				{
					cron: "0 9 1,15 * 1,3,5",
					expectAmbiguous: false,
					expectSuccess: true,
				},
				{
					cron: "30 14 */2 * 1-5",
					expectAmbiguous: false,
					expectSuccess: true,
				},
				{
					cron: "0 0 25 12 *",
					expectAmbiguous: false,
					expectSuccess: true,
				},
			];

			for (const testCase of testCases) {
				const isAmbiguous = detectAmbiguousSchedule(testCase.cron);
				const result = await calculateNextRuns(testCase.cron, "en-US");

				expect(isAmbiguous).toBe(testCase.expectAmbiguous);
				expect(result.hasAmbiguousSchedule).toBe(testCase.expectAmbiguous);

				if (testCase.expectSuccess) {
					expect(result.error).toBeNull();
					expect(result.runs).toHaveLength(5);
				} else {
					expect(result.error).not.toBeNull();
					expect(result.runs).toEqual([]);
				}
			}
		});
	});
});
