import ky from "ky";
import type { ApiResponse, ApiSuccess } from "./apiTypes";

const API_URL = "https://kronilo.timothybrits.workers.dev/api/translate";

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
