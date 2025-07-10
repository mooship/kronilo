import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "react-use";
import { isValidCronFormat } from "../utils/cronValidation";

export interface UseCronValidation {
	error: string | undefined;
	clearError: () => void;
}

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
		if (debouncedCron.length > 100) {
			setError("Input too long (max 100 characters)");
		} else if (debouncedCron && !isValidCronFormat(debouncedCron)) {
			setError("Invalid cron format. Expected: minute hour day month weekday");
		} else {
			setError(undefined);
		}
	}, [debouncedCron]);

	const clearError = useCallback(() => {
		if (error && cron.length <= 100) {
			setError(undefined);
		}
	}, [error, cron]);

	return useMemo(() => ({ error, clearError }), [error, clearError]);
}
