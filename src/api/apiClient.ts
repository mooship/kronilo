import ky from "ky";
import type { ApiRequestResult } from "../types/api";
import { getApiErrorMessage } from "../utils/errorMessages";

export async function apiRequest<T>(
	url: string,
	options?: RequestInit,
): Promise<ApiRequestResult<T>> {
	try {
		const response = await ky(url, options);
		const data = await response.json<T>();
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
