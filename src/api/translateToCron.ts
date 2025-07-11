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
			throw new Error(response.error);
		}

		return response;
	} catch (err) {
		throw err instanceof Error ? err : new Error(String(err));
	}
}
