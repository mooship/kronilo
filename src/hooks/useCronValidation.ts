import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import type { UseCronValidation } from "../types/hooks";
import type { I18nCronError } from "../types/i18n";
import { getCronErrors } from "../utils/cronValidation";

/**
 * React hook for validating cron expressions with debouncing and error state.
 *
 * @param cron The cron expression to validate
 * @returns {UseCronValidation} An object containing:
 *   - error: Array of I18nCronError objects (with key and values for i18n translation/interpolation), or undefined if no errors.
 *   - clearError: Callback to clear the error state if input is valid length.
 */
export function useCronValidation(cron: string): UseCronValidation {
	const [debouncedCron] = useDebounceValue(cron, 500);
	const [errors, setErrors] = useState<I18nCronError[] | undefined>(undefined);

	useEffect(() => {
		if (debouncedCron.length > 200) {
			setErrors([{ key: "errors.inputTooLong", values: { max: 200 } }]);
		} else if (debouncedCron) {
			const cronErrors = getCronErrors(debouncedCron);
			setErrors(cronErrors.length > 0 ? cronErrors : undefined);
		} else {
			setErrors(undefined);
		}
	}, [debouncedCron]);

	/**
	 * Clears the current error state if the input is within the valid length.
	 * Only clears errors if present and cron length is <= 200.
	 */
	const clearError = useCallback(() => {
		if (errors && cron.length <= 200) {
			setErrors(undefined);
		}
	}, [errors, cron]);

	return useMemo(() => ({ error: errors, clearError }), [errors, clearError]);
}
