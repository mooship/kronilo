import type { FetchOptions } from "ofetch";
import { ofetch } from "ofetch";
import type { ApiRequestResult } from "../types/api";
import { getApiErrorMessage } from "../utils/errorMessages";

/**
 * Internal fetcher for apiRequest. Used for test injection.
 */
let _fetcher: typeof ofetch = ofetch;

/**
 * For testing: override the fetch implementation used by apiRequest.
 * @param fetchImpl The fetch implementation to use (should match ofetch signature)
 */
export function __setApiFetcher(fetchImpl: typeof ofetch) {
	_fetcher = fetchImpl;
}

/**
 * Make an API request using ofetch and return a typed result.
 * Handles timeout and network errors with user-friendly messages.
 *
 * @template T The expected response data type
 * @param url The endpoint URL
 * @param options Optional fetch options (ofetch FetchOptions)
 * @returns ApiRequestResult<T> containing data or error and status
 */
export async function apiRequest<T>(
	url: string,
	options?: FetchOptions,
): Promise<ApiRequestResult<T>> {
	try {
		const data = await _fetcher<T>(url, {
			...options,
			responseType: "json",
		});
		return { data, status: 200 };
	} catch (err) {
		let status = 0;
		let errorData: unknown = err;
		if (
			err &&
			typeof err === "object" &&
			"status" in err &&
			typeof (err as { status?: unknown }).status === "number"
		) {
			status = (err as { status: number }).status;
		}
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
