/** Regular expression to detect URLs in error messages */
const URL_REGEX = /https?:\/\//;

/** Regular expression to detect HTTP status codes (4xx and 5xx) in error messages */
const STATUS_CODE_REGEX = /\b(4\d{2}|5\d{2})\b/;

/**
 * Array of error message patterns that are safe to display to users.
 * These patterns either match exact strings or regex patterns for user-friendly error messages.
 */
const SAFE_ERROR_PATTERNS = [
	"Rate limit exceeded. Please try again later.",
	"Daily API limit reached. Please try again tomorrow.",
	"Input too long (max 200 characters)",
	"Missing input field",
	"Could not translate input to a valid cron expression after retrying",
	"Input cannot be empty. Please enter a schedule in English.",
	/^Daily limit reached \(\d+\/\d+\)\. Try again tomorrow\.$/,
	/^Daily usage: \d+\/\d+$/,
	"Network error. Please check your connection.",
	"Request timeout. Please try again.",
	"Service temporarily unavailable.",
];

/**
 * Checks if an error message matches any of the predefined safe error patterns.
 *
 * @param message - The error message to check
 * @returns True if the message is safe to display to users
 */
function isSafeErrorMessage(message: string): boolean {
	return SAFE_ERROR_PATTERNS.some((pattern) => {
		if (typeof pattern === "string") {
			return message === pattern;
		}
		return pattern.test(message);
	});
}

/**
 * Checks if an error message is generically safe to display to users.
 * This performs additional validation beyond the predefined patterns to ensure
 * the message doesn't contain sensitive information like URLs, stack traces, or internal errors.
 *
 * @param message - The error message to validate
 * @returns True if the message appears safe for user display
 */
function isGenericSafeMessage(message: string): boolean {
	return (
		message.length <= 150 &&
		!URL_REGEX.test(message) &&
		!STATUS_CODE_REGEX.test(message) &&
		!message.includes("Error:") &&
		!message.includes("Exception:") &&
		!message.includes("Stack trace") &&
		!message.toLowerCase().includes("internal server") &&
		!message.toLowerCase().includes("database") &&
		!message.toLowerCase().includes("connection")
	);
}

/**
 * Safely extracts and formats error messages for display to users.
 * This function sanitizes error messages to prevent exposure of sensitive information
 * while providing meaningful feedback to users.
 *
 * @param err - The error object, string, or unknown value to process
 * @returns A user-friendly error message safe for display
 *
 * @example
 * ```typescript
 * try {
 *   await riskyOperation();
 * } catch (error) {
 *   const userMessage = getApiErrorMessage(error);
 *   showToast(userMessage); // Safe to display
 * }
 * ```
 */
export function getApiErrorMessage(err: unknown): string {
	if (typeof err === "string") {
		if (isSafeErrorMessage(err) || isGenericSafeMessage(err)) {
			return err;
		}
		return "Sorry, something went wrong. Please try again.";
	}

	if (err instanceof Error) {
		if (isSafeErrorMessage(err.message) || isGenericSafeMessage(err.message)) {
			return err.message;
		}
		return "Sorry, something went wrong. Please try again.";
	}

	if (typeof err === "object" && err !== null) {
		if (
			"error" in err &&
			typeof (err as Record<string, unknown>).error === "string"
		) {
			const msg = (err as Record<string, unknown>).error as string;
			if (isSafeErrorMessage(msg) || isGenericSafeMessage(msg)) {
				return msg;
			}
			return "Sorry, something went wrong. Please try again.";
		}
		if (
			"message" in err &&
			typeof (err as Record<string, unknown>).message === "string"
		) {
			const msg = (err as Record<string, unknown>).message as string;
			if (isSafeErrorMessage(msg) || isGenericSafeMessage(msg)) {
				return msg;
			}
			return "Sorry, something went wrong. Please try again.";
		}
	}
	return "An unexpected error occurred. Please try again.";
}
