import type { Options } from "ky";
import ky from "ky";
import type { ApiRequestResult } from "../types/api";
import { getApiErrorMessage } from "./getApiErrorMessage";

/**
 * Makes an HTTP request using the ky library with comprehensive error handling.
 *
 * @template T - The expected type of the response data
 * @param url - The URL to make the request to
 * @param options - Optional ky configuration options (method, headers, body, etc.)
 * @returns A promise that resolves to an ApiRequestResult containing either data or error information
 *
 * @example
 * ```typescript
 * const result = await apiRequest<User>('/api/users/1');
 * if (result.error) {
 *   console.error(result.error);
 * } else {
 *   console.log(result.data); // User object
 * }
 * ```
 */
export async function apiRequest<T>(
	url: string,
	options?: Options,
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
			"response" in err &&
			(err as { response?: unknown }).response instanceof Response
		) {
			const response = (err as { response: Response }).response;
			status = response.status;

			try {
				const jsonError = await response.json();
				errorData = jsonError;
			} catch {
				if (status === 408) {
					errorData = "Request timeout. Please try again.";
				} else if (status === 503) {
					errorData = "Service temporarily unavailable.";
				} else {
					errorData = err;
				}
			}
		} else if (
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
