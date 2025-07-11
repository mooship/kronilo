import ky from "ky";
import type { ApiResponse, ApiSuccess } from "./apiTypes";

const BASE_URL = "https://kronilo.timothybrits.workers.dev";
const API_URL = `${BASE_URL}/api/translate`;
const RATE_LIMIT_URL = `${BASE_URL}/openrouter/rate-limit`;

export async function checkRateLimit(): Promise<{
	rateLimited: boolean;
	message?: string;
}> {
	try {
		const response = await ky
			.get(RATE_LIMIT_URL, { timeout: 5000 })
			.json<{ rateLimited: boolean; message?: string }>();
		return response;
	} catch {
		return { rateLimited: false };
	}
}

export async function translateToCron(input: string): Promise<ApiSuccess> {
	if (!input.trim()) {
		throw new Error("Input cannot be empty");
	}

	try {
		const response = await ky
			.post(API_URL, {
				json: { input },
				timeout: 10000,
			})
			.json<ApiResponse>();

		if ("error" in response) {
			const safeMsg =
				typeof response.error === "string" &&
				response.error.length < 100 &&
				!response.error.includes("http")
					? response.error
					: "Sorry, something went wrong. Please try again.";
			throw new Error(safeMsg);
		}

		return response;
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err);
		if (
			msg === "Input cannot be empty" ||
			msg.toLowerCase().includes("timeout") ||
			msg.toLowerCase().includes("network")
		) {
			throw new Error(
				"Network error. Please check your connection and try again.",
			);
		}
		if (msg.includes("http") || msg.length > 100) {
			throw new Error("Sorry, something went wrong. Please try again.");
		}
		throw new Error(msg);
	}
}
