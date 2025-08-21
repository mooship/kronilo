import type { StateCreator } from "zustand";
import { type KroniloStore, KroniloStoreSchema } from "../schemas/kroniloStore";
import type { KroniloState } from "../types/store";
import {
	getStoredCron,
	getStoredDismissedUntil,
	setStoredCron,
	setStoredDismissedUntil,
} from "./storePersistence";

/**
 * kroniloStoreShape
 *
 * Zustand state creator defining the persistent parts of the app-wide store.
 * The store exposes simple helpers for showing the donation modal, tracking
 * usage counts, and storing/retrieving the user's current cron expression
 * and donation dismissal date. Persistence is delegated to
 * `storePersistence` helpers. Uses KroniloStoreSchema for validation.
 */
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
