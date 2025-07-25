import { describe, expect, it } from "vitest";
import { getApiErrorMessage } from "../errorMessages";

describe("errorMessages", () => {
	it("should return safe error messages for known patterns", () => {
		expect(
			getApiErrorMessage("Rate limit exceeded. Please try again later."),
		).toBe("Rate limit exceeded. Please try again later.");
		expect(
			getApiErrorMessage("Daily API limit reached. Please try again tomorrow."),
		).toBe("Daily API limit reached. Please try again tomorrow.");
		expect(getApiErrorMessage("Input too long (max 200 characters)")).toBe(
			"Input too long (max 200 characters)",
		);
	});

	it("should return generic fallback for unsafe error strings", () => {
		expect(getApiErrorMessage("Error: Internal server error")).toBe(
			"Sorry, something went wrong. Please try again.",
		);
		expect(getApiErrorMessage("Exception: Database connection failed")).toBe(
			"Sorry, something went wrong. Please try again.",
		);
	});

	it("should handle Error objects", () => {
		expect(
			getApiErrorMessage(
				new Error("Rate limit exceeded. Please try again later."),
			),
		).toBe("Rate limit exceeded. Please try again later.");
		expect(getApiErrorMessage(new Error("Some unknown error"))).toBe(
			"Sorry, something went wrong. Please try again.",
		);
	});

	it("should handle objects with error/message properties", () => {
		expect(
			getApiErrorMessage({ error: "Input too long (max 200 characters)" }),
		).toBe("Input too long (max 200 characters)");
		expect(
			getApiErrorMessage({
				message: "Network error. Please check your connection.",
			}),
		).toBe("Network error. Please check your connection.");
		expect(getApiErrorMessage({ error: "Some unsafe error" })).toBe(
			"Sorry, something went wrong. Please try again.",
		);
	});

	it("should return a generic message for unknown input", () => {
		expect(getApiErrorMessage(123)).toBe(
			"An unexpected error occurred. Please try again.",
		);
		expect(getApiErrorMessage(undefined)).toBe(
			"An unexpected error occurred. Please try again.",
		);
	});
});
