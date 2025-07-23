import { describe, expect, it } from "vitest";
import { isValidCronFormat, WHITESPACE_REGEX } from "../cronValidation";

describe("cronValidation", () => {
	describe("WHITESPACE_REGEX", () => {
		it("should match single spaces", () => {
			expect("a b".split(WHITESPACE_REGEX)).toEqual(["a", "b"]);
		});

		it("should match multiple spaces", () => {
			expect("a   b".split(WHITESPACE_REGEX)).toEqual(["a", "b"]);
		});

		it("should match tabs", () => {
			expect("a\tb".split(WHITESPACE_REGEX)).toEqual(["a", "b"]);
		});

		it("should match mixed whitespace", () => {
			expect("a \t  b".split(WHITESPACE_REGEX)).toEqual(["a", "b"]);
		});
	});

	describe("isValidCronFormat", () => {
		describe("basic validation", () => {
			it("should return false for empty string", () => {
				expect(isValidCronFormat("")).toBe(false);
			});

			it("should return false for null/undefined", () => {
				// @ts-expect-error - Testing invalid input types
				expect(isValidCronFormat(null)).toBe(false);
				// @ts-expect-error - Testing invalid input types
				expect(isValidCronFormat(undefined)).toBe(false);
			});

			it("should return false for non-string input", () => {
				// @ts-expect-error - Testing invalid input types
				expect(isValidCronFormat(123)).toBe(false);
				// @ts-expect-error - Testing invalid input types
				expect(isValidCronFormat({})).toBe(false);
			});

			it("should return false for wrong number of fields", () => {
				expect(isValidCronFormat("* * *")).toBe(false);
				expect(isValidCronFormat("* * * *")).toBe(false);
				expect(isValidCronFormat("* * * * * *")).toBe(false);
			});
		});

		describe("valid cron expressions", () => {
			it("should validate basic asterisk pattern", () => {
				expect(isValidCronFormat("* * * * *")).toBe(true);
			});

			it("should validate specific values", () => {
				expect(isValidCronFormat("0 0 1 1 0")).toBe(true);
				expect(isValidCronFormat("59 23 31 12 7")).toBe(true);
			});

			it("should validate range expressions", () => {
				expect(isValidCronFormat("0-59 0-23 1-31 1-12 0-7")).toBe(true);
				expect(isValidCronFormat("0-30 9-17 1-15 6-8 1-5")).toBe(true);
			});

			it("should validate step expressions", () => {
				expect(isValidCronFormat("*/5 * * * *")).toBe(true);
				expect(isValidCronFormat("0 */2 * * *")).toBe(true);
				expect(isValidCronFormat("0 0 */3 * *")).toBe(true);
				expect(isValidCronFormat("0-30/5 * * * *")).toBe(true);
			});

			it("should validate list expressions", () => {
				expect(isValidCronFormat("0,15,30,45 * * * *")).toBe(true);
				expect(isValidCronFormat("0 9,12,15 * * *")).toBe(true);
				expect(isValidCronFormat("0 0 1,15 * *")).toBe(true);
			});

			it("should validate mixed expressions", () => {
				expect(isValidCronFormat("0,30 9-17 * * 1-5")).toBe(true);
				expect(isValidCronFormat("*/15 8-18/2 1,15 * *")).toBe(true);
			});

			it("should handle Sunday as both 0 and 7", () => {
				expect(isValidCronFormat("0 0 * * 0")).toBe(true);
				expect(isValidCronFormat("0 0 * * 7")).toBe(true);
			});
		});

		describe("minute field validation (0-59)", () => {
			it("should validate valid minutes", () => {
				expect(isValidCronFormat("0 * * * *")).toBe(true);
				expect(isValidCronFormat("59 * * * *")).toBe(true);
				expect(isValidCronFormat("30 * * * *")).toBe(true);
			});

			it("should reject invalid minutes", () => {
				expect(isValidCronFormat("-1 * * * *")).toBe(false);
				expect(isValidCronFormat("60 * * * *")).toBe(false);
				expect(isValidCronFormat("abc * * * *")).toBe(false);
			});

			it("should validate minute ranges", () => {
				expect(isValidCronFormat("0-59 * * * *")).toBe(true);
				expect(isValidCronFormat("15-45 * * * *")).toBe(true);
			});

			it("should reject invalid minute ranges", () => {
				expect(isValidCronFormat("60-70 * * * *")).toBe(false);
				expect(isValidCronFormat("30-15 * * * *")).toBe(false);
				expect(isValidCronFormat("-5-10 * * * *")).toBe(false);
			});

			it("should validate minute lists", () => {
				expect(isValidCronFormat("0,15,30,45 * * * *")).toBe(true);
				expect(isValidCronFormat("5,10,55 * * * *")).toBe(true);
			});

			it("should reject invalid minute lists", () => {
				expect(isValidCronFormat("0,60,30 * * * *")).toBe(false);
				expect(isValidCronFormat("0,,30 * * * *")).toBe(false);
			});
		});

		describe("hour field validation (0-23)", () => {
			it("should validate valid hours", () => {
				expect(isValidCronFormat("* 0 * * *")).toBe(true);
				expect(isValidCronFormat("* 23 * * *")).toBe(true);
				expect(isValidCronFormat("* 12 * * *")).toBe(true);
			});

			it("should reject invalid hours", () => {
				expect(isValidCronFormat("* -1 * * *")).toBe(false);
				expect(isValidCronFormat("* 24 * * *")).toBe(false);
				expect(isValidCronFormat("* abc * * *")).toBe(false);
			});

			it("should validate hour ranges", () => {
				expect(isValidCronFormat("* 0-23 * * *")).toBe(true);
				expect(isValidCronFormat("* 9-17 * * *")).toBe(true);
			});

			it("should reject invalid hour ranges", () => {
				expect(isValidCronFormat("* 24-30 * * *")).toBe(false);
				expect(isValidCronFormat("* 18-9 * * *")).toBe(false);
			});
		});

		describe("day field validation (1-31)", () => {
			it("should validate valid days", () => {
				expect(isValidCronFormat("* * 1 * *")).toBe(true);
				expect(isValidCronFormat("* * 31 * *")).toBe(true);
				expect(isValidCronFormat("* * 15 * *")).toBe(true);
			});

			it("should reject invalid days", () => {
				expect(isValidCronFormat("* * 0 * *")).toBe(false);
				expect(isValidCronFormat("* * 32 * *")).toBe(false);
				expect(isValidCronFormat("* * abc * *")).toBe(false);
			});

			it("should validate day ranges", () => {
				expect(isValidCronFormat("* * 1-31 * *")).toBe(true);
				expect(isValidCronFormat("* * 10-20 * *")).toBe(true);
			});

			it("should reject invalid day ranges", () => {
				expect(isValidCronFormat("* * 0-10 * *")).toBe(false);
				expect(isValidCronFormat("* * 32-40 * *")).toBe(false);
				expect(isValidCronFormat("* * 20-10 * *")).toBe(false);
			});
		});

		describe("month field validation (1-12)", () => {
			it("should validate valid months", () => {
				expect(isValidCronFormat("* * * 1 *")).toBe(true);
				expect(isValidCronFormat("* * * 12 *")).toBe(true);
				expect(isValidCronFormat("* * * 6 *")).toBe(true);
			});

			it("should reject invalid months", () => {
				expect(isValidCronFormat("* * * 0 *")).toBe(false);
				expect(isValidCronFormat("* * * 13 *")).toBe(false);
				expect(isValidCronFormat("* * * abc *")).toBe(false);
			});

			it("should validate month ranges", () => {
				expect(isValidCronFormat("* * * 1-12 *")).toBe(true);
				expect(isValidCronFormat("* * * 6-8 *")).toBe(true);
			});

			it("should reject invalid month ranges", () => {
				expect(isValidCronFormat("* * * 0-6 *")).toBe(false);
				expect(isValidCronFormat("* * * 13-20 *")).toBe(false);
				expect(isValidCronFormat("* * * 8-3 *")).toBe(false);
			});
		});

		describe("weekday field validation (0-7)", () => {
			it("should validate valid weekdays", () => {
				expect(isValidCronFormat("* * * * 0")).toBe(true);
				expect(isValidCronFormat("* * * * 7")).toBe(true);
				expect(isValidCronFormat("* * * * 3")).toBe(true);
			});

			it("should reject invalid weekdays", () => {
				expect(isValidCronFormat("* * * * -1")).toBe(false);
				expect(isValidCronFormat("* * * * 8")).toBe(false);
				expect(isValidCronFormat("* * * * abc")).toBe(false);
			});

			it("should validate weekday ranges", () => {
				expect(isValidCronFormat("* * * * 0-7")).toBe(true);
				expect(isValidCronFormat("* * * * 1-5")).toBe(true);
			});

			it("should reject invalid weekday ranges", () => {
				expect(isValidCronFormat("* * * * -1-3")).toBe(false);
				expect(isValidCronFormat("* * * * 8-10")).toBe(false);
				expect(isValidCronFormat("* * * * 5-1")).toBe(false);
			});
		});

		describe("step expressions", () => {
			it("should validate basic steps", () => {
				expect(isValidCronFormat("*/5 * * * *")).toBe(true);
				expect(isValidCronFormat("0 */2 * * *")).toBe(true);
				expect(isValidCronFormat("0 0 */3 * *")).toBe(true);
			});

			it("should validate range steps", () => {
				expect(isValidCronFormat("0-30/5 * * * *")).toBe(true);
				expect(isValidCronFormat("* 9-17/2 * * *")).toBe(true);
			});

			it("should reject invalid steps", () => {
				expect(isValidCronFormat("*/0 * * * *")).toBe(false);
				expect(isValidCronFormat("*/-1 * * * *")).toBe(false);
				expect(isValidCronFormat("*/ * * * *")).toBe(false);
				expect(isValidCronFormat("*/abc * * * *")).toBe(false);
			});
		});

		describe("edge cases", () => {
			it("should handle extra whitespace", () => {
				expect(isValidCronFormat("  0   0   *   *   *  ")).toBe(true);
				expect(isValidCronFormat("0\t0\t*\t*\t*")).toBe(true);
			});

			it("should handle mixed whitespace types", () => {
				expect(isValidCronFormat("0 \t 0  *\t*   *")).toBe(true);
			});

			it("should reject expressions with commas at the end", () => {
				expect(isValidCronFormat("0,15, * * * *")).toBe(false);
			});

			it("should reject expressions with empty comma parts", () => {
				expect(isValidCronFormat("0,,15 * * * *")).toBe(false);
			});
		});

		describe("real-world examples", () => {
			it("should validate common cron expressions", () => {
				expect(isValidCronFormat("*/5 * * * *")).toBe(true);
				expect(isValidCronFormat("0 * * * *")).toBe(true);
				expect(isValidCronFormat("0 0 * * *")).toBe(true);
				expect(isValidCronFormat("0 9 * * 1-5")).toBe(true);
				expect(isValidCronFormat("0 0 1 * *")).toBe(true);
				expect(isValidCronFormat("0 0 * * 0")).toBe(true);
				expect(isValidCronFormat("*/15 9-17 * * 1-5")).toBe(true);
				expect(isValidCronFormat("0 8,20 * * *")).toBe(true);
			});
		});
	});
});
