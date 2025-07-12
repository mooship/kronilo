/**
 * State interface for the Kronilo application store.
 * Manages donation modal state, usage tracking (mode-specific counters), cron expressions, and rate limiting.
 *
 * Donation Modal Logic:
 * - Modal triggers after 2 natural language → cron translations, or 5 cron → natural language translations (mode-specific counters).
 * - Usage counters are incremented only after successful translations in each mode.
 * - Modal postponement is handled globally ("Maybe Later" sets a 14-day delay).
 */
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

	rateLimited: boolean;
	rateLimitMsg: string | null;
	setRateLimited: (rateLimited: boolean, msg?: string | null) => void;
}
