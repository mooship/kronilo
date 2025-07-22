import { create } from "zustand";
import type { KroniloState } from "./types/store";
import { isValidCronFormat } from "./utils/cronValidation";
import { getItem, removeItem, setItem } from "./utils/storage";

const getStoredDismissedUntil = (): Date | null => {
	const stored = getItem("kronilo-dismissed-until");
	return stored ? new Date(stored) : null;
};

const setStoredDismissedUntil = (date: Date | null): void => {
	if (date) {
		setItem("kronilo-dismissed-until", date.toISOString());
	} else {
		removeItem("kronilo-dismissed-until");
	}
};

const getStoredCron = (): string => {
	const stored = getItem("kronilo-cron");
	return stored ?? "*/5 * * * *";
};

const setStoredCron = (cron: string): void => {
	if (isValidCronFormat(cron)) {
		setItem("kronilo-cron", cron);
	} else {
		removeItem("kronilo-cron");
	}
};

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
}));
