import { QueryClient } from "@tanstack/react-query";

/**
 * Shared React Query client instance for the Kronilo app.
 *
 * Configures default options for queries and mutations.
 */
export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000,
			retry: 2,
			refetchOnWindowFocus: false,
		},
		mutations: {
			retry: 1,
		},
	},
});
