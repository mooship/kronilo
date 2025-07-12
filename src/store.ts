import { create } from "zustand";
import type { KroniloState } from "./types/store";
import { isValidCronFormat } from "./utils/cronValidation";
import { getItem, removeItem, setItem } from "./utils/localStorageUtils";

/**
 * Retrieves the stored dismissal date for the donation modal from localStorage.
 * @returns The stored date or null if no date is stored
 */
const getStoredDismissedUntil = (): Date | null => {
	const stored = getItem("kronilo-dismissed-until");
	return stored ? new Date(stored) : null;
};

/**
 * Stores the donation modal dismissal date in localStorage.
 * @param date - The date until which the modal should be dismissed, or null to remove
 */
const setStoredDismissedUntil = (date: Date | null): void => {
	if (date) {
		setItem("kronilo-dismissed-until", date.toISOString());
	} else {
		removeItem("kronilo-dismissed-until");
	}
};

/**
 * Retrieves the stored cron expression from localStorage.
 * @returns The stored cron expression or a default value
 */
const getStoredCron = (): string => {
	const stored = getItem("kronilo-cron");
	return stored ?? "*/5 * * * *";
};

/**
 * Stores a valid cron expression in localStorage or removes invalid ones.
 * @param cron - The cron expression to store
 */
const setStoredCron = (cron: string): void => {
	if (isValidCronFormat(cron)) {
		setItem("kronilo-cron", cron);
	} else {
		removeItem("kronilo-cron");
	}
};

/**
 * Zustand store for managing application-wide state.
 * Handles donation modal state, usage tracking, cron expressions, and rate limiting.
 */
export const useKroniloStore = create<KroniloState>((set, get) => ({
	donationModalOpen: false,
	setDonationModalOpen: (open) => set({ donationModalOpen: open }),

	cronToNaturalUsageCount: 0,
	naturalToCronUsageCount: 0,
	incrementCronToNaturalUsage: () =>
		set((state) => ({
			cronToNaturalUsageCount: state.cronToNaturalUsageCount + 1,
		})),
	incrementNaturalToCronUsage: () =>
		set((state) => ({
			naturalToCronUsageCount: state.naturalToCronUsageCount + 1,
		})),
	resetCronToNaturalUsage: () => set({ cronToNaturalUsageCount: 0 }),
	resetNaturalToCronUsage: () => set({ naturalToCronUsageCount: 0 }),

	dismissedUntil: getStoredDismissedUntil(),
	setDismissedUntil: (date) => {
		setStoredDismissedUntil(date);
		set({ dismissedUntil: date });
	},
	canShowDonationModal: () => {
		const { dismissedUntil } = get();
		if (!dismissedUntil) {
			return true;
		}
		return new Date() > dismissedUntil;
	},

	cron: getStoredCron(),
	setCron: (cron) => {
		setStoredCron(cron);
		set({ cron });
	},

	rateLimited: false,
	rateLimitMsg: null,
	setRateLimited: (rateLimited, msg = null) =>
		set({ rateLimited, rateLimitMsg: msg }),
}));
