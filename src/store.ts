import { create } from "zustand";

interface KroniloState {
	darkMode: boolean;
	setDarkMode: (value: boolean) => void;

	donationModalOpen: boolean;
	setDonationModalOpen: (open: boolean) => void;

	usageCount: number;
	incrementUsage: () => void;
	resetUsage: () => void;

	dismissedUntil: Date | null;
	setDismissedUntil: (date: Date | null) => void;
	canShowDonationModal: () => boolean;
}

// Helper functions for localStorage
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
	} catch {
		// Silently fail if localStorage is not available
	}
};

export const useKroniloStore = create<KroniloState>((set, get) => ({
	darkMode: false,
	setDarkMode: (value) => set({ darkMode: value }),

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
		if (!dismissedUntil) return true;
		return new Date() > dismissedUntil;
	},
}));
