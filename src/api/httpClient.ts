import type { ApiRequestResult } from "../types/api";
import { getApiErrorMessage } from "./errorUtils";

async function fetchWrapper(
	url: string,
	options?: RequestInit,
): Promise<Response> {
	return fetch(url, options);
}

export async function apiRequest<T>(
	url: string,
	options?: RequestInit,
): Promise<ApiRequestResult<T>> {
	try {
		const response = await fetchWrapper(url, options);
		const data = await response.json();
		return { data, status: response.status };
	} catch (err: unknown) {
		let status = 0;
		let errorData: unknown = err;
		if (
			typeof err === "object" &&
			err !== null &&
			"name" in err &&
			(err as { name: string }).name === "TimeoutError"
		) {
			errorData = "Request timeout. Please try again.";
			status = 408;
		} else if (
			typeof err === "object" &&
			err !== null &&
			"message" in err &&
			typeof (err as { message: string }).message === "string" &&
			(err as { message: string }).message.toLowerCase().includes("network")
		) {
			errorData = "Network error. Please check your connection.";
			status = 0;
		}

		return {
			error: getApiErrorMessage(errorData),
			status,
		};
	}
}
