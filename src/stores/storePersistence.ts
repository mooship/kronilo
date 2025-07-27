import { isValidCronFormat } from "../utils/cronValidation";
import { getItem, removeItem, setItem } from "../utils/storage";

/**
 * Get the stored date until which the donation modal is dismissed.
 * @returns {Date | null} The dismissed until date, or null if not set.
 */
export const getStoredDismissedUntil = (): Date | null => {
	const stored = getItem("kronilo-dismissed-until");
	return stored ? new Date(stored) : null;
};

/**
 * Set the date until which the donation modal is dismissed.
 * @param date The date to store, or null to remove.
 */
export const setStoredDismissedUntil = (date: Date | null): void => {
	if (date) {
		setItem("kronilo-dismissed-until", date.toISOString());
	} else {
		removeItem("kronilo-dismissed-until");
	}
};

/**
 * Get the stored cron expression, or a default if not set.
 * @returns {string} The stored cron expression or default.
 */
export const getStoredCron = (): string => {
	const stored = getItem("kronilo-cron");
	return stored ?? "*/5 * * * *";
};

/**
 * Set the cron expression in storage if valid, otherwise remove it.
 * @param cron The cron expression to store.
 */
export const setStoredCron = (cron: string): void => {
	if (isValidCronFormat(cron)) {
		setItem("kronilo-cron", cron);
	} else {
		removeItem("kronilo-cron");
	}
};
