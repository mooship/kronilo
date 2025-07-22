export interface KroniloState {
	donationModalOpen: boolean;
	setDonationModalOpen: (open: boolean) => void;
	cronToNaturalUsageCount: number;
	naturalToCronUsageCount: number;
	incrementCronToNaturalUsage: () => void;
	incrementNaturalToCronUsage: () => void;
	resetCronToNaturalUsage: () => void;
	resetNaturalToCronUsage: () => void;
	dismissedUntil: Date | null;
	setDismissedUntil: (date: Date | null) => void;
	canShowDonationModal: () => boolean;
	cron: string;
	setCron: (cron: string) => void;
}
