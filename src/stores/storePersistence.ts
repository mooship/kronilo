import { cronSchema } from "../schemas/cron";
import { persistedSchema } from "../schemas/persisted";
import { getItem, removeItem, setItem } from "../utils/storage";

export const getStoredDismissedUntil = (): Date | null => {
	const stored = getItem("kronilo-dismissed-until");
	if (!stored) {
		return null;
	}
	const parsed = persistedSchema.shape.dismissedUntil.safeParse(stored);
	if (!parsed.success) {
		return null;
	}
	return new Date(stored);
};

export const setStoredDismissedUntil = (date: Date | null): void => {
	if (date) {
		setItem("kronilo-dismissed-until", date.toISOString());
	} else {
		removeItem("kronilo-dismissed-until");
	}
};

export const getStoredCron = (): string => {
	const stored = getItem("kronilo-cron");
	if (!stored) return "*/5 * * * *";
	return cronSchema.safeParse(stored).success ? stored : "*/5 * * * *";
};

export const setStoredCron = (cron: string): void => {
	if (cronSchema.safeParse(cron).success) {
		setItem("kronilo-cron", cron);
	} else {
		removeItem("kronilo-cron");
	}
};
