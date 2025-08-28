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

		expect(expressions).toContain("*/5 * * * *");
		expect(expressions).toContain("0 * * * *");
		expect(expressions).toContain("0 0 * * *");
		expect(expressions).toContain("0 0 * * 0");
	});

	it("descriptions are human-readable", () => {
		for (const suggestion of CRON_SUGGESTIONS) {
			expect(suggestion.description[0]).toMatch(/[A-Z]/);
			expect(suggestion.description).toMatch(/\s/);

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
		expect(Array.isArray(CRON_SUGGESTIONS)).toBe(true);
		expect(CRON_SUGGESTIONS.length).toBeGreaterThan(0);

		const firstItem = CRON_SUGGESTIONS[0];
		expect(firstItem).toHaveProperty("expression");
		expect(firstItem).toHaveProperty("description");
		expect(typeof firstItem.expression).toBe("string");
		expect(typeof firstItem.description).toBe("string");
	});
});
