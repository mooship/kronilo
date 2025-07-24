const URL_REGEX = /https?:\/\//;

const STATUS_CODE_REGEX = /\b(4\d{2}|5\d{2})\b/;

const SAFE_ERROR_PATTERNS: (string | RegExp)[] = [
	"Rate limit exceeded. Please try again later.",
	"Daily API limit reached. Please try again tomorrow.",
	"Input too long (max 200 characters)",
	"Missing input field",
	"Could not translate input to a valid cron expression after retrying",
	"Input cannot be empty. Please enter a schedule in natural language.",
	new RegExp(/^Daily limit reached \(\d+\/\d+\)\. Try again tomorrow\.$/),
	new RegExp(/^Daily usage: \d+\/\d+$/),
	"Network error. Please check your connection.",
	"Request timeout. Please try again.",
	"Service temporarily unavailable.",
];

function isSafeErrorMessage(message: string): boolean {
	return SAFE_ERROR_PATTERNS.some((pattern) =>
		typeof pattern === "string" ? message === pattern : pattern.test(message),
	);
}

function isGenericSafeMessage(message: string): boolean {
	const lower = message.toLowerCase();
	return (
		message.length <= 150 &&
		!URL_REGEX.test(message) &&
		!STATUS_CODE_REGEX.test(message) &&
		!message.includes("Error:") &&
		!message.includes("Exception:") &&
		!message.includes("Stack trace") &&
		!lower.includes("internal server") &&
		!lower.includes("database") &&
		!lower.includes("connection")
	);
}

export function getApiErrorMessage(err: unknown): string {
	function safe(msg: string): string | undefined {
		if (isSafeErrorMessage(msg) || isGenericSafeMessage(msg)) return msg;
		return undefined;
	}

	if (typeof err === "string") {
		return safe(err) ?? "Sorry, something went wrong. Please try again.";
	}
	if (err instanceof Error) {
		return (
			safe(err.message) ?? "Sorry, something went wrong. Please try again."
		);
	}
	if (typeof err === "object" && err !== null) {
		const errorObj = err as Record<string, unknown>;
		if (typeof errorObj.error === "string") {
			return (
				safe(errorObj.error) ?? "Sorry, something went wrong. Please try again."
			);
		}
		if (typeof errorObj.message === "string") {
			return (
				safe(errorObj.message) ??
				"Sorry, something went wrong. Please try again."
			);
		}
	}
	return "An unexpected error occurred. Please try again.";
}
