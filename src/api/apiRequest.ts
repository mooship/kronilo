import type { Options } from "ky";
import ky from "ky";
import { getApiErrorMessage } from "./getApiErrorMessage";

export interface ApiRequestResult<T> {
	data?: T;
	error?: string;
	status: number;
}

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
		if (
			typeof err === "object" &&
			err !== null &&
			"response" in err &&
			(err as { response?: unknown }).response instanceof Response
		) {
			status = (err as { response: Response }).response.status;
		}
		return {
			error: getApiErrorMessage(err),
			status,
		};
	}
}
