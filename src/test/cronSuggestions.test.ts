/**
 * Unit tests for cron suggestions constants and utilities.
 *
 * These tests verify that the predefined cron suggestions are valid,
 * properly structured, and human-readable. All tests are pure and focus
 * on data integrity and consistency.
 */
import { describe, expect, it } from "bun:test";
import { CRON_SUGGESTIONS } from "../utils/cronSuggestions";
import { isValidCronFormat } from "../utils/cronValidation";

describe("CRON_SUGGESTIONS", () => {
	it("contains an array of suggestion objects (sanity check)", () => {
		expect(Array.isArray(CRON_SUGGESTIONS)).toBe(true);
		expect(CRON_SUGGESTIONS.length).toBeGreaterThan(0);
	});

	it("each suggestion has required properties", () => {
		for (const suggestion of CRON_SUGGESTIONS) {
			expect(suggestion).toHaveProperty("expression");
			expect(suggestion).toHaveProperty("description");
			expect(typeof suggestion.expression).toBe("string");
			expect(typeof suggestion.description).toBe("string");
			expect(suggestion.expression.length).toBeGreaterThan(0);
			expect(suggestion.description.length).toBeGreaterThan(0);
		}
	});

	it("all cron expressions are valid", () => {
		for (const suggestion of CRON_SUGGESTIONS) {
			expect(isValidCronFormat(suggestion.expression)).toBe(true);
		}
	});

	it("contains expected common patterns", () => {
		const expressions = CRON_SUGGESTIONS.map((s) => s.expression);

		// Should contain these common patterns
		expect(expressions).toContain("*/5 * * * *"); // Every 5 minutes
		expect(expressions).toContain("0 * * * *"); // Every hour
		expect(expressions).toContain("0 0 * * *"); // Every day
		expect(expressions).toContain("0 0 * * 0"); // Every Sunday
	});

	it("descriptions are human-readable", () => {
		for (const suggestion of CRON_SUGGESTIONS) {
			// Should be sentence-like (start with capital, contain spaces)
			expect(suggestion.description[0]).toMatch(/[A-Z]/);
			expect(suggestion.description).toMatch(/\s/);

			// Should not be too long or too short
			expect(suggestion.description.length).toBeGreaterThan(5);
			expect(suggestion.description.length).toBeLessThan(100);
		}
	});

	it("has no duplicate expressions", () => {
		const expressions = CRON_SUGGESTIONS.map((s) => s.expression);
		const uniqueExpressions = new Set(expressions);
		expect(uniqueExpressions.size).toBe(expressions.length);
	});

	it("has no duplicate descriptions", () => {
		const descriptions = CRON_SUGGESTIONS.map((s) => s.description);
		const uniqueDescriptions = new Set(descriptions);
		expect(uniqueDescriptions.size).toBe(descriptions.length);
	});

	it("maintains consistent structure as const array", () => {
		// Verify CRON_SUGGESTIONS is properly structured
		expect(Array.isArray(CRON_SUGGESTIONS)).toBe(true);
		expect(CRON_SUGGESTIONS.length).toBeGreaterThan(0);

		// Verify first item has expected structure (testing const works)
		const firstItem = CRON_SUGGESTIONS[0];
		expect(firstItem).toHaveProperty("expression");
		expect(firstItem).toHaveProperty("description");
		expect(typeof firstItem.expression).toBe("string");
		expect(typeof firstItem.description).toBe("string");
	});
});
