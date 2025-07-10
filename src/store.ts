import { create } from "zustand";
import { isValidCronFormat } from "./utils/cronValidation";

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
}

const getStoredDismissedUntil = (): Date | null => {
	try {
		const stored = localStorage.getItem("kronilo-dismissed-until");
		return stored ? new Date(stored) : null;
	} catch {
		return null;
	}
};

const setStoredDismissedUntil = (date: Date | null): void => {
	try {
		if (date) {
			localStorage.setItem("kronilo-dismissed-until", date.toISOString());
		} else {
			localStorage.removeItem("kronilo-dismissed-until");
		}
	} catch {}
};

const getStoredCron = (): string => {
	try {
		const stored = localStorage.getItem("kronilo-cron");
		return stored ?? "*/5 * * * *";
	} catch {
		return "*/5 * * * *";
	}
};

const setStoredCron = (cron: string): void => {
	try {
		if (isValidCronFormat(cron)) {
			localStorage.setItem("kronilo-cron", cron);
		} else {
			localStorage.removeItem("kronilo-cron");
		}
	} catch {}
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
}));
