import type { StateCreator } from "zustand";
import type { KroniloState } from "../types/store";
import {
	getStoredCron,
	getStoredDismissedUntil,
	setStoredCron,
	setStoredDismissedUntil,
} from "./storePersistence";

export const kroniloStoreShape: StateCreator<KroniloState> = (set, get) => ({
	donationModalOpen: false,
	setDonationModalOpen: (open) => set({ donationModalOpen: open }),
	cronToNaturalUsageCount: 0,
	incrementCronToNaturalUsage: () =>
		set((state: KroniloState) => ({
			cronToNaturalUsageCount: state.cronToNaturalUsageCount + 1,
		})),
	resetCronToNaturalUsage: () => set({ cronToNaturalUsageCount: 0 }),
	dismissedUntil: getStoredDismissedUntil(),
	setDismissedUntil: (date) => {
		setStoredDismissedUntil(date);
		set({ dismissedUntil: date });
	},
	canShowDonationModal: () => {
		const { dismissedUntil } = get();
		if (!dismissedUntil) return true;
		return new Date() > dismissedUntil;
	},
	cron: getStoredCron(),
	setCron: (cron) => {
		setStoredCron(cron);
		set({ cron });
	},
});
