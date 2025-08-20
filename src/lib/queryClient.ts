import { QueryClient } from "@tanstack/react-query";

/**
 * queryClient
 *
 * Shared, pre-configured QueryClient instance for the application. Configure
 * common default options here so all queries/mutations behave consistently.
 *
 * Defaults applied:
 * - queries:
 *   - staleTime: 5 minutes (keeps data fresh for a short window)
 *   - retry: 2 (retry transient failures twice)
 *   - refetchOnWindowFocus: false (avoid automatic refetch on focus)
 * - mutations:
 *   - retry: 1
 *
 * Use this exported `queryClient` when wrapping the app with
 * `QueryClientProvider`.
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
