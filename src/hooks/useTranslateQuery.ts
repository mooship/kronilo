import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { checkRateLimit, translateToCron } from "../api/translate";
import type { RateLimitResult } from "../types/api";

export function useRateLimit() {
	return useQuery({
		queryKey: ["rateLimit"],
		queryFn: checkRateLimit,
		refetchInterval: (query) => {
			const data = query.state.data as RateLimitResult | undefined;
			return data?.rateLimited ? 30000 : false;
		},
		staleTime: 0,
	});
}

export function useTranslateToCron() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (input: string) => {
			let attempt = 0;
			let lastError: Error | null = null;

			const limitRes = await checkRateLimit();
			if (limitRes.rateLimited) {
				queryClient.setQueryData(["rateLimit"], limitRes);
				throw new Error(
					typeof limitRes.details === "string"
						? limitRes.details
						: JSON.stringify(limitRes.details ?? "Rate limit exceeded"),
				);
			}

			while (attempt < 2) {
				try {
					const result = await translateToCron(input);

					if (result.status === 429 && result.rateLimitType) {
						const rateLimitData: RateLimitResult = {
							rateLimited: true,
							status: result.status,
							details: result.error || "Rate limit exceeded",
						};
						queryClient.setQueryData(["rateLimit"], rateLimitData);
						throw new Error(result.error || "Rate limit exceeded");
					}

					if (result.data?.cron) {
						return result.data;
					}

					if (result.error) {
						if (
							result.status >= 400 &&
							result.status < 500 &&
							result.status !== 408
						) {
							throw new Error(result.error);
						}
						lastError = new Error(result.error);
						throw lastError;
					}

					lastError = new Error("Unexpected error occurred");
					throw lastError;
				} catch (err) {
					lastError = err instanceof Error ? err : new Error(String(err));
					attempt++;

					if (attempt < 2) {
						await new Promise((resolve) => setTimeout(resolve, 500));
					}
				}
			}

			throw lastError || new Error("Translation failed after retries");
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["rateLimit"] });
		},
	});
}
