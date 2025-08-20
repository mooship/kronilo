import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import type { UseCronValidation } from "../types/hooks";
import type { I18nCronError } from "../types/i18n";
import { getCronErrors } from "../utils/cronValidation";

/**
 * useCronValidation
 *
 * Custom hook that validates a cron expression string. The hook debounces
 * validation (500ms) to avoid frequent checks while the user types. It also
 * enforces a maximum input length and maps validation results to
 * i18n-friendly error objects.
 *
 * @param {string} cron - The cron expression to validate.
 * @returns {{ error?: I18nCronError[]; clearError: () => void }}
 * - `error`: undefined when valid, or an array of i18n-ready error objects
 * - `clearError`: convenience function to clear errors when conditions change
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

	const clearError = useCallback(() => {
		if (errors && cron.length <= 200) {
			setErrors(undefined);
		}
	}, [errors, cron]);

	return useMemo(() => ({ error: errors, clearError }), [errors, clearError]);
}
