/**
 * KroniloState
 *
 * Shape of the global Zustand store. Exposes state and simple actions for
 * UI-level concerns such as donation modal visibility and the user's current
 * cron expression.
 */
export interface KroniloState {
	donationModalOpen: boolean;
	setDonationModalOpen: (open: boolean) => void;
	cronToNaturalUsageCount: number;
	incrementCronToNaturalUsage: () => void;
	resetCronToNaturalUsage: () => void;
	dismissedUntil: Date | null;
	setDismissedUntil: (date: Date | null) => void;
	canShowDonationModal: () => boolean;
	cron: string;
	setCron: (cron: string) => void;
}
