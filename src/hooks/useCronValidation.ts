import { useState } from "react";
import { useDebouncedEffect } from "../hooks/useDebouncedEffect";
import { isValidCronFormat } from "../utils/cronValidation";

export function useCronValidation(cron: string) {
	const [error, setError] = useState<string | undefined>(undefined);

	useDebouncedEffect(
		() => {
			if (cron.length > 100) {
				setError("Input too long (max 100 characters)");
			} else if (cron && !isValidCronFormat(cron)) {
				setError(
					"Invalid cron format. Expected: minute hour day month weekday",
				);
			} else {
				setError(undefined);
			}
			return undefined;
		},
		[cron],
		500,
	);

	const clearError = () => {
		if (error && cron.length <= 100) {
			setError(undefined);
		}
	};

	return { error, clearError };
}
