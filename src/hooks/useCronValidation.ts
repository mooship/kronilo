import { isEmpty } from "radash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import type { UseCronValidation } from "../types/hooks";
import type { I18nCronError } from "../types/i18n";
import { getCronErrors } from "../utils/cronValidation";

export function useCronValidation(cron: string): UseCronValidation {
	const [debouncedCron] = useDebounceValue(cron, 500);
	const [errors, setErrors] = useState<I18nCronError[] | undefined>(undefined);

	useEffect(() => {
		if (debouncedCron.length > 200) {
			setErrors([{ key: "errors.inputTooLong", values: { max: 200 } }]);
		} else if (debouncedCron) {
			const cronErrors = getCronErrors(debouncedCron);
			setErrors(!isEmpty(cronErrors) ? cronErrors : undefined);
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
