import type { StateCreator } from "zustand";
import type { KroniloState } from "../types/store";
import {
	getStoredCron,
	getStoredDismissedUntil,
	setStoredCron,
	setStoredDismissedUntil,
} from "./storePersistence";

/**
 * Zustand state creator for Kronilo global state.
 *
 * Contains modal state, usage counters, cron persistence, and donation modal logic.
 *
 * @param set Zustand set function
 * @param get Zustand get function
 * @returns KroniloState object with state and actions
 */
export const kroniloStoreShape: StateCreator<KroniloState> = (set, get) => ({
	/** Whether the donation modal is open */
	donationModalOpen: false,
	/** Set the donation modal open state */
	setDonationModalOpen: (open) => set({ donationModalOpen: open }),

	/** Usage count for cron-to-natural feature */
	cronToNaturalUsageCount: 0,
	/** Usage count for natural-to-cron feature */
	naturalToCronUsageCount: 0,
	/** Increment cron-to-natural usage count */
	incrementCronToNaturalUsage: () =>
		set((state: KroniloState) => ({
			cronToNaturalUsageCount: state.cronToNaturalUsageCount + 1,
		})),
	/** Increment natural-to-cron usage count */
	incrementNaturalToCronUsage: () =>
		set((state: KroniloState) => ({
			naturalToCronUsageCount: state.naturalToCronUsageCount + 1,
		})),
	/** Reset cron-to-natural usage count */
	resetCronToNaturalUsage: () => set({ cronToNaturalUsageCount: 0 }),
	/** Reset natural-to-cron usage count */
	resetNaturalToCronUsage: () => set({ naturalToCronUsageCount: 0 }),

	/** Date until which donation modal is dismissed */
	dismissedUntil: getStoredDismissedUntil(),
	/** Set the dismissedUntil date for donation modal */
	setDismissedUntil: (date) => {
		setStoredDismissedUntil(date);
		set({ dismissedUntil: date });
	},
	/**
	 * Whether the donation modal can be shown (not dismissed or expired)
	 * @returns {boolean}
	 */
	canShowDonationModal: () => {
		const { dismissedUntil } = get();
		if (!dismissedUntil) return true;
		return new Date() > dismissedUntil;
	},

	/** Last used cron expression (persisted) */
	cron: getStoredCron(),
	/** Set the current cron expression and persist it */
	setCron: (cron) => {
		setStoredCron(cron);
		set({ cron });
	},
});
