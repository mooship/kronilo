const URL_REGEX = /https?:\/\//;

const STATUS_CODE_REGEX = /\b(4\d{2}|5\d{2})\b/;

const SAFE_ERROR_PATTERNS = [
	"Rate limit exceeded. Please try again later.",
	"Daily API limit reached. Please try again tomorrow.",
	"Input too long (max 200 characters)",
	"Missing input field",
	"Could not translate input to a valid cron expression after retrying",
	"Input cannot be empty. Please enter a schedule in natural language.",
	/^Daily limit reached \(\d+\/\d+\)\. Try again tomorrow\.$/,
	/^Daily usage: \d+\/\d+$/,
	"Network error. Please check your connection.",
	"Request timeout. Please try again.",
	"Service temporarily unavailable.",
];

function isSafeErrorMessage(message: string): boolean {
	return SAFE_ERROR_PATTERNS.some((pattern) => {
		if (typeof pattern === "string") {
			return message === pattern;
		}
		return pattern.test(message);
	});
}

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
