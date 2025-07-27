import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import type { UseCronValidation } from "../types/hooks";
import { getCronErrors } from "../utils/cronValidation";

/**
 * React hook for validating cron expressions with debouncing and error state.
 *
 * @param cron The cron expression to validate
 * @returns {UseCronValidation} Error state and clearError callback
 */
export function useCronValidation(cron: string): UseCronValidation {
	const [debouncedCron] = useDebounceValue(cron, 500);
	const [errors, setErrors] = useState<string[] | undefined>(undefined);

	useEffect(() => {
		if (debouncedCron.length > 200) {
			setErrors(["Input too long (max 200 characters)"]);
		} else if (debouncedCron) {
			const cronErrors = getCronErrors(debouncedCron);
			setErrors(cronErrors.length > 0 ? cronErrors : undefined);
		} else {
			setErrors(undefined);
		}
	}, [debouncedCron]);

	/**
	 * Clear the current error state if input is valid length.
	 */
	const clearError = useCallback(() => {
		if (errors && cron.length <= 200) {
			setErrors(undefined);
		}
	}, [errors, cron]);

	return useMemo(() => ({ error: errors, clearError }), [errors, clearError]);
}
