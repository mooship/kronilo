import { isValidCronFormat } from "../utils/cronValidation";
import { getItem, removeItem, setItem } from "../utils/storage";

/**
 * getStoredDismissedUntil
 *
 * Reads the dismissed-until timestamp from storage and returns a `Date` or
 * null when not set.
 */
export const getStoredDismissedUntil = (): Date | null => {
	const stored = getItem("kronilo-dismissed-until");
	return stored ? new Date(stored) : null;
};

/**
 * setStoredDismissedUntil
 *
 * Persists or removes the dismissed-until timestamp used to postpone the
 * donation modal.
 */
export const setStoredDismissedUntil = (date: Date | null): void => {
	if (date) {
		setItem("kronilo-dismissed-until", date.toISOString());
	} else {
		removeItem("kronilo-dismissed-until");
	}
};

/**
 * getStoredCron
 *
 * Returns the stored cron expression or a sensible default (every 5 minutes)
 * if none exists.
 */
export const getStoredCron = (): string => {
	const stored = getItem("kronilo-cron");
	return stored ?? "*/5 * * * *";
};

/**
 * setStoredCron
 *
 * Persists a cron expression only when it passes a lightweight format
 * validation. When the value is invalid the stored key is removed.
 */
export const setStoredCron = (cron: string): void => {
	if (isValidCronFormat(cron)) {
		setItem("kronilo-cron", cron);
	} else {
		removeItem("kronilo-cron");
	}
};
