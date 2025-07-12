/**
 * State interface for the Kronilo application store.
 * Manages donation modal state, usage tracking, cron expressions, and rate limiting.
 */
export interface KroniloState {
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
