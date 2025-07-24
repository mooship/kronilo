export async function fetchWrapper(
	url: string,
	options?: RequestInit,
): Promise<Response> {
	return fetch(url, options);
}
