import type {
	ApiResponse,
	ApiSuccess,
	HealthResponse,
	RateLimitResult,
} from "../types/api";
import { getApiErrorMessage } from "../utils/errorMessages";
import { apiRequest } from "./apiClient";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE_URL}/api/translate`;
const HEALTH_URL = `${BASE_URL}/health`;

/**
 * Check the API rate limit status by calling the health endpoint.
 *
 * @returns {Promise<RateLimitResult>} Rate limit status and details
 */
export async function checkRateLimit(): Promise<RateLimitResult> {
	const result = await apiRequest<HealthResponse>(HEALTH_URL, {
		method: "GET",
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
 * Translate a natural language input to a cron expression using the API.
 * Handles input validation, error, and rate limit responses.
 *
 * @param input The natural language schedule to translate
 * @returns {Promise<{data?: ApiSuccess; error?: string; status: number; rateLimitType?: "perUser" | "daily"}>}
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

	const result = await apiRequest<ApiResponse>(API_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ input }),
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
