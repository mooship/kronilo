import { apiRequest } from "./apiRequest";
import type { ApiResponse, ApiSuccess } from "./apiTypes";
import { getApiErrorMessage } from "./getApiErrorMessage";

const BASE_URL = "https://kronilo.timothybrits.workers.dev";
const API_URL = `${BASE_URL}/api/translate`;
const RATE_LIMIT_URL = `${BASE_URL}/openrouter/rate-limit`;

export interface RateLimitResult {
	rateLimited: boolean;
	status: number;
	details?: string | object;
}

export async function checkRateLimit(): Promise<RateLimitResult> {
	const result = await apiRequest<{
		rateLimited: boolean;
		details?: string | object;
	}>(RATE_LIMIT_URL, { method: "get", timeout: 5000 });
	if (result.error) {
		return {
			rateLimited: false,
			status: result.status,
			details: result.error,
		};
	}
	if (result.data) {
		return {
			rateLimited: result.data.rateLimited,
			status: result.status,
			details: result.data.details,
		};
	}
	return {
		rateLimited: false,
		status: result.status,
		details: "Unknown error.",
	};
}

export async function translateToCron(input: string): Promise<{
	data?: ApiSuccess;
	error?: string;
	status: number;
}> {
	if (!input.trim()) {
		return {
			error: getApiErrorMessage(
				"Input cannot be empty. Please enter a schedule in English.",
			),
			status: 400,
		};
	}
	const result = await apiRequest<ApiResponse>(API_URL, {
		method: "post",
		json: { input },
		timeout: 10000,
	});
	if (result.error) {
		return { error: result.error, status: result.status };
	}
	if (result.data && "error" in result.data) {
		return { error: getApiErrorMessage(result.data), status: result.status };
	}
	if (result.data) {
		return { data: result.data as ApiSuccess, status: result.status };
	}
	return { error: "Unknown error.", status: result.status };
}
