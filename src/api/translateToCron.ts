import { apiRequest } from "./apiRequest";
import type { ApiResponse, ApiSuccess } from "./apiTypes";
import { getApiErrorMessage } from "./getApiErrorMessage";

const BASE_URL = "https://kronilo.timothybrits.workers.dev";
const API_URL = `${BASE_URL}/api/translate`;
const RATE_LIMIT_URL = `${BASE_URL}/openrouter/rate-limit`;

export async function checkRateLimit(): Promise<{
	rateLimited: boolean;
	message?: string;
	status: number;
}> {
	const result = await apiRequest<{ rateLimited: boolean; message?: string }>(
		RATE_LIMIT_URL,
		{ method: "get", timeout: 5000 },
	);
	if (result.error) {
		return {
			rateLimited: result.status === 429,
			message: result.error,
			status: result.status,
		};
	}
	if (result.data) {
		return { ...result.data, status: result.status };
	}
	return {
		rateLimited: false,
		message: "Unknown error.",
		status: result.status,
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
