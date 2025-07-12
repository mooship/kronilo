import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "react-use";
import type { UseCronValidation } from "../types/hooks";
import { isValidCronFormat } from "../utils/cronValidation";

/**
 * Custom hook for validating cron expressions with debounced input.
 * Provides real-time validation feedback with a delay to avoid excessive validation calls.
 *
 * @param cron - The cron expression to validate
 * @returns Object containing validation error and error clearing function
 *
 * @example
 * ```typescript
 * const { error, clearError } = useCronValidation(cronExpression);
 * if (error) {
 *   console.error(error);
 * }
 * ```
 */
export function useCronValidation(cron: string): UseCronValidation {
	const [error, setError] = useState<string | undefined>(undefined);
	const [debouncedCron, setDebouncedCron] = useState(cron);

	useDebounce(
		() => {
			setDebouncedCron(cron);
		},
		500,
		[cron],
	);

	useEffect(() => {
		if (debouncedCron.length > 200) {
			setError("Input too long (max 200 characters)");
		} else if (debouncedCron && !isValidCronFormat(debouncedCron)) {
			setError("Invalid cron format. Expected: minute hour day month weekday");
		} else {
			setError(undefined);
		}
	}, [debouncedCron]);

	const clearError = useCallback(() => {
		if (error && cron.length <= 200) {
			setError(undefined);
		}
	}, [error, cron]);

	return useMemo(() => ({ error, clearError }), [error, clearError]);
}
