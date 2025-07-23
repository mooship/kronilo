import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import type { UseCronValidation } from "../types/hooks";
import { isValidCronFormat } from "../utils/cronValidation";

export function useCronValidation(cron: string): UseCronValidation {
	const [debouncedCron] = useDebounceValue(cron, 500);
	const [error, setError] = useState<string | undefined>(undefined);

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
