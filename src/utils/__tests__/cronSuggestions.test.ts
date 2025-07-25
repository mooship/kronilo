import { describe, expect, it } from "vitest";
import { CRON_SUGGESTIONS } from "../cronSuggestions";

describe("cronSuggestions", () => {
	it("should export an array of suggestions", () => {
		expect(Array.isArray(CRON_SUGGESTIONS)).toBe(true);
		expect(CRON_SUGGESTIONS.length).toBeGreaterThan(0);
	});

	it("should have valid cron expressions and descriptions", () => {
		for (const suggestion of CRON_SUGGESTIONS) {
			expect(typeof suggestion.expression).toBe("string");
			expect(typeof suggestion.description).toBe("string");
			expect(suggestion.expression).not.toBe("");
			expect(suggestion.description).not.toBe("");
		}
	});
});
