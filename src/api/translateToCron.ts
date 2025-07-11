import ky from "ky";
import type { ApiResponse, ApiSuccess } from "./apiTypes";

const BASE_URL = "https://kronilo.timothybrits.workers.dev";
const API_URL = `${BASE_URL}/api/translate`;
const RATE_LIMIT_URL = `${BASE_URL}/openrouter/rate-limit`;

function isKyErrorWithResponse(err: unknown): err is { response: Response } {
	return (
		typeof err === "object" &&
		!!err &&
		"response" in err &&
		typeof (err as { response?: unknown }).response === "object" &&
		(err as { response: Response }).response instanceof Response
	);
}

export async function checkRateLimit(): Promise<{
	rateLimited: boolean;
	message?: string;
	status: number;
}> {
	try {
		const response = await ky.get(RATE_LIMIT_URL, { timeout: 5000 });
		const data = await response.json<{
			rateLimited: boolean;
			message?: string;
		}>();
		return { ...data, status: response.status };
	} catch (err: unknown) {
		if (isKyErrorWithResponse(err)) {
			const status = err.response.status;
			if (status === 429)
				return {
					rateLimited: true,
					message:
						"You are currently rate limited. Please try again in a few minutes.",
					status,
				};
			if (status === 401)
				return {
					rateLimited: false,
					message:
						"API key is invalid or missing. Please check your credentials or contact support.",
					status,
				};
			return {
				rateLimited: false,
				message:
					"An unexpected error occurred. Please try again or contact support.",
				status,
			};
		}
		return {
			rateLimited: false,
			message: "Network error. Please check your connection and try again.",
			status: 0,
		};
	}
}

export async function translateToCron(input: string): Promise<{
	data?: ApiSuccess;
	error?: string;
	status: number;
}> {
	if (!input.trim()) {
		return {
			error: "Input cannot be empty. Please enter a schedule in English.",
			status: 400,
		};
	}

	try {
		const response = await ky.post(API_URL, {
			json: { input },
			timeout: 10000,
		});
		const data = await response.json<ApiResponse>();
		if ("error" in data) {
			return {
				error:
					typeof data.error === "string" &&
					data.error.length < 100 &&
					!data.error.includes("http")
						? data.error
						: "Sorry, something went wrong. Please try again or contact support.",
				status: response.status,
			};
		}
		return { data: data as ApiSuccess, status: response.status };
	} catch (err: unknown) {
		if (isKyErrorWithResponse(err)) {
			const status = err.response.status;
			if (status === 429)
				return {
					error:
						"You are currently rate limited. Please try again in a few minutes.",
					status,
				};
			if (status === 401)
				return {
					error:
						"API key is invalid or missing. Please check your credentials or contact support.",
					status,
				};
			if (status === 400)
				return {
					error: "Input cannot be empty. Please enter a schedule in English.",
					status,
				};
			return {
				error:
					"An unexpected error occurred. Please try again or contact support.",
				status,
			};
		}
		const msg = err instanceof Error ? err.message : String(err);
		if (
			msg === "Input cannot be empty" ||
			msg.toLowerCase().includes("timeout") ||
			msg.toLowerCase().includes("network")
		) {
			return {
				error: "Network error. Please check your connection and try again.",
				status: 0,
			};
		}
		if (msg.includes("http") || msg.length > 100) {
			return {
				error:
					"Sorry, something went wrong. Please try again or contact support.",
				status: 0,
			};
		}
		return { error: msg, status: 0 };
	}
}
