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
