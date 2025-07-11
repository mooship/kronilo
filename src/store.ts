import { create } from "zustand";
import { isValidCronFormat } from "./utils/cronValidation";
import { getItem, removeItem, setItem } from "./utils/localStorageUtils";

interface KroniloState {
	donationModalOpen: boolean;
	setDonationModalOpen: (open: boolean) => void;

	usageCount: number;
	incrementUsage: () => void;
	resetUsage: () => void;

	dismissedUntil: Date | null;
	setDismissedUntil: (date: Date | null) => void;
	canShowDonationModal: () => boolean;

	cron: string;
	setCron: (cron: string) => void;

	rateLimited: boolean;
	rateLimitMsg: string | null;
	setRateLimited: (rateLimited: boolean, msg?: string | null) => void;
}

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

	usageCount: 0,
	incrementUsage: () => set((state) => ({ usageCount: state.usageCount + 1 })),
	resetUsage: () => set({ usageCount: 0 }),

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
