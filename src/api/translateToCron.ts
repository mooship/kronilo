import { franc } from "franc";
import type {
	ApiResponse,
	ApiSuccess,
	HealthResponse,
	RateLimitResult,
} from "../types/api";
import { apiRequest } from "./apiRequest";
import { getApiErrorMessage } from "./getApiErrorMessage";

/** Base URL for the API, loaded from environment variables */
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/** URL endpoint for translating natural language to cron expressions */
const API_URL = `${BASE_URL}/api/translate`;

/** URL endpoint for checking API health and rate limits */
const HEALTH_URL = `${BASE_URL}/health`;

/**
 * Checks the current rate limit status for the API.
 * This function queries the health endpoint to determine if the user has exceeded
 * their daily usage limits and provides detailed information about current usage.
 *
 * @returns Promise resolving to rate limit information including current usage and remaining quota
 *
 * @example
 * ```typescript
 * const rateInfo = await checkRateLimit();
 * if (rateInfo.rateLimited) {
 *   console.log(rateInfo.details); // "Daily limit reached (100/100). Try again tomorrow."
 * }
 * ```
 */
export async function checkRateLimit(): Promise<RateLimitResult> {
	const result = await apiRequest<HealthResponse>(HEALTH_URL, {
		method: "get",
		timeout: 5000,
	});

	if (result.error) {
		return {
			rateLimited: false,
			status: result.status,
			details: result.error,
		};
	}

	if (result.data) {
		if (result.data.status === "error") {
			return {
				rateLimited: false,
				status: result.status,
				details: result.data.error || "Service error",
			};
		}

		const dailyRateLimit = result.data.rateLimit?.daily;

		if (!dailyRateLimit) {
			return {
				rateLimited: false,
				status: result.status,
				details: "Rate limit information unavailable",
			};
		}

		const rateLimited = dailyRateLimit.remaining <= 0;
		const details = rateLimited
			? `Daily limit reached (${dailyRateLimit.used}/${dailyRateLimit.limit}). Try again tomorrow.`
			: `Daily usage: ${dailyRateLimit.used}/${dailyRateLimit.limit}`;

		return {
			rateLimited,
			status: result.status,
			details,
		};
	}

	return {
		rateLimited: false,
		status: result.status,
		details: "Unknown error.",
	};
}

/**
 * Translates a natural language schedule description into a cron expression.
 * This function sends the input and language to the API service and handles various error conditions
 * including rate limiting and validation errors.
 *
 * @param input - Natural language description of the schedule (e.g., "every day at 9am")
 * @returns Promise resolving to either a successful cron translation or error information
 *
 * @example
 * ```typescript
 * import { useTranslation } from "react-i18next";
 * const { i18n } = useTranslation();
 * const result = await translateToCron("every day at 9am");
 * if (result.error) {
 *   console.error(result.error);
 * } else {
 *   console.log(result.data?.cron); // "0 9 * * *"
 * }
 * ```
 */

export async function translateToCron(input: string): Promise<{
	data?: ApiSuccess;
	error?: string;
	status: number;
	rateLimitType?: "perUser" | "daily";
}> {
	if (!input.trim()) {
		return {
			error: getApiErrorMessage(
				"Input cannot be empty. Please enter a schedule in natural language.",
			),
			status: 400,
		};
	}

	let detectedLanguage = "en";
	try {
		const code = franc(input);
		detectedLanguage = code && code !== "und" ? code : "en";
	} catch {
		detectedLanguage = "en";
	}

	const result = await apiRequest<ApiResponse>(API_URL, {
		method: "post",
		json: { input, language: detectedLanguage },
		timeout: 10000,
	});

	if (result.error) {
		return { error: result.error, status: result.status };
	}

	if (result.data && "error" in result.data) {
		const errorData = result.data;

		if (result.status === 429 && errorData.rateLimitType) {
			return {
				error: errorData.error,
				status: result.status,
				rateLimitType: errorData.rateLimitType,
			};
		}

		return { error: getApiErrorMessage(errorData), status: result.status };
	}

	if (result.data) {
		return { data: result.data as ApiSuccess, status: result.status };
	}

	return { error: "Unknown error.", status: result.status };
}
