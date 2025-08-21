/**
 * Unit tests for persisted data schemas using Zod validation.
 *
 * These tests verify that the persistence layer correctly validates cron expressions
 * and date strings before accepting them for storage. Both valid and invalid cases
 * are covered to ensure robust schema enforcement.
 */
import { describe, expect, it } from "bun:test";
import { persistedSchema } from "../schemas/persisted";

describe("persistedSchema", () => {
	describe("valid data", () => {
		it("accepts valid cron expression", () => {
			const data = { cron: "*/5 * * * *" };
			const result = persistedSchema.safeParse(data);
			expect(result.success).toBe(true);
		});

		it("accepts valid dismissedUntil ISO string", () => {
			const data = { dismissedUntil: "2099-01-01T00:00:00.000Z" };
			const result = persistedSchema.safeParse(data);
			expect(result.success).toBe(true);
		});

		it("accepts both cron and dismissedUntil", () => {
			const data = {
				cron: "0 0 * * 0",
				dismissedUntil: "2099-01-01T00:00:00.000Z",
			};
			const result = persistedSchema.safeParse(data);
			expect(result.success).toBe(true);
		});

		it("accepts undefined cron", () => {
			const data = { cron: undefined };
			const result = persistedSchema.safeParse(data);
			expect(result.success).toBe(true);
		});

		it("accepts null dismissedUntil", () => {
			const data = { dismissedUntil: null };
			const result = persistedSchema.safeParse(data);
			expect(result.success).toBe(true);
		});

		it("accepts undefined dismissedUntil", () => {
			const data = { dismissedUntil: undefined };
			const result = persistedSchema.safeParse(data);
			expect(result.success).toBe(true);
		});

		it("accepts empty object", () => {
			const data = {};
			const result = persistedSchema.safeParse(data);
			expect(result.success).toBe(true);
		});

		it("accepts various valid cron formats", () => {
			const validCrons = [
				"* * * * *",
				"0 0 * * 0",
				"*/15 * * * *",
				"0 9-17 * * 1-5",
				"0 0 1 * *",
			];

			for (const cron of validCrons) {
				const data = { cron };
				const result = persistedSchema.safeParse(data);
				expect(result.success).toBe(true);
			}
		});

		it("accepts various valid date formats", () => {
			const validDates = [
				"2099-01-01T00:00:00.000Z",
				"2025-12-31T23:59:59.999Z",
				"2024-02-29T12:00:00.000Z", // leap year
				new Date().toISOString(),
			];

			for (const dismissedUntil of validDates) {
				const data = { dismissedUntil };
				const result = persistedSchema.safeParse(data);
				expect(result.success).toBe(true);
			}
		});
	});

	describe("invalid data", () => {
		it("rejects invalid cron expression", () => {
			const data = { cron: "invalid cron" };
			const result = persistedSchema.safeParse(data);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe("Invalid cron");
			}
		});

		it("rejects invalid dismissedUntil string", () => {
			const data = { dismissedUntil: "not a date" };
			const result = persistedSchema.safeParse(data);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe("Invalid date");
			}
		});

		it("rejects various invalid cron formats", () => {
			const invalidCrons = [
				"* * * *", // too few fields
				"* * * * * *", // too many fields
				"60 24 32 13 8", // out of range
				"a b c d e", // invalid characters
				"", // empty string
				"*/0 * * * *", // zero step
			];

			for (const cron of invalidCrons) {
				const data = { cron };
				const result = persistedSchema.safeParse(data);
				expect(result.success).toBe(false);
			}
		});

		it("rejects various invalid date strings", () => {
			const invalidDates = [
				"2025-13-01", // invalid month
				"2025-01-32", // invalid day
				"not-a-date",
				"", // empty string
				"invalid-format",
				"abc123",
			];

			for (const dismissedUntil of invalidDates) {
				const data = { dismissedUntil };
				const result = persistedSchema.safeParse(data);
				expect(result.success).toBe(false);
			}
		});

		it("handles mixed valid/invalid data", () => {
			const data = {
				cron: "*/5 * * * *", // valid
				dismissedUntil: "not a date", // invalid
			};
			const result = persistedSchema.safeParse(data);
			expect(result.success).toBe(false);
		});
	});

	describe("edge cases", () => {
		it("accepts complex cron expressions", () => {
			const complexCrons = [
				"15,45 9-17 * * 1-5", // specific minutes, work hours, weekdays
				"0 */2 1-15 * *", // every 2 hours, first half of month
				"30 6 * * 1,3,5", // specific weekdays
			];

			for (const cron of complexCrons) {
				const data = { cron };
				const result = persistedSchema.safeParse(data);
				expect(result.success).toBe(true);
			}
		});

		it("handles date edge cases", () => {
			const edgeCaseDates = [
				"2024-02-29T00:00:00.000Z", // leap year Feb 29
				"1970-01-01T00:00:00.000Z", // Unix epoch
				"2099-12-31T23:59:59.999Z", // far future
			];

			for (const dismissedUntil of edgeCaseDates) {
				const data = { dismissedUntil };
				const result = persistedSchema.safeParse(data);
				expect(result.success).toBe(true);
			}
		});

		it("provides detailed error information", () => {
			const data = {
				cron: "invalid",
				dismissedUntil: "also invalid",
			};
			const result = persistedSchema.safeParse(data);
			expect(result.success).toBe(false);

			if (!result.success) {
				expect(result.error.issues.length).toBe(2);
				const messages = result.error.issues.map((issue) => issue.message);
				expect(messages).toContain("Invalid cron");
				expect(messages).toContain("Invalid date");
			}
		});
	});
});
