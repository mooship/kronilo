import type { StateCreator } from "zustand";
import { type KroniloStore, KroniloStoreSchema } from "../schemas/kroniloStore";
import type { KroniloState } from "../types/store";
import {
	getStoredCron,
	getStoredDismissedUntil,
	setStoredCron,
	setStoredDismissedUntil,
} from "./storePersistence";

export const kroniloStoreShape: StateCreator<KroniloState> = (set, get) => {
	const hydrated: KroniloStore = KroniloStoreSchema.parse({
		donationModalOpen: false,
		cronToNaturalUsageCount: 0,
		dismissedUntil: getStoredDismissedUntil(),
		cron: getStoredCron() ?? "",
	});

	return {
		...hydrated,
		setDonationModalOpen: (open) => set({ donationModalOpen: open }),
		incrementCronToNaturalUsage: () =>
			set((state: KroniloState) => ({
				cronToNaturalUsageCount: state.cronToNaturalUsageCount + 1,
			})),
		resetCronToNaturalUsage: () => set({ cronToNaturalUsageCount: 0 }),
		setDismissedUntil: (date) => {
			setStoredDismissedUntil(date);
			set({ dismissedUntil: date });
		},
		canShowDonationModal: () => {
			const { dismissedUntil } = get();
			if (!dismissedUntil) return true;
			return new Date() > dismissedUntil;
		},
		setCron: (cron) => {
			setStoredCron(cron);
			set({ cron: cron ?? "" });
		},
	};
};
