import { useEffect } from "react";
import { useKroniloStore } from "../store";
import type { UseDonationModal } from "../types/hooks";

/**
 * Custom hook for managing donation modal state and behavior.
 * Automatically shows the donation modal after 5 uses and handles user interactions
 * like closing the modal or postponing it for 14 days.
 *
 * @returns Object containing modal state and handler functions
 *
 * @example
 * ```typescript
 * const {
 *   donationModalOpen,
 *   handleFooterDonateClick,
 *   handleCloseModal,
 *   handleMaybeLater
 * } = useDonationModal();
 * ```
 */
export function useDonationModal(): UseDonationModal {
	const donationModalOpen = useKroniloStore((s) => s.donationModalOpen);
	const setDonationModalOpen = useKroniloStore((s) => s.setDonationModalOpen);
	const cronToNaturalUsageCount = useKroniloStore(
		(s) => s.cronToNaturalUsageCount,
	);
	const naturalToCronUsageCount = useKroniloStore(
		(s) => s.naturalToCronUsageCount,
	);
	const resetCronToNaturalUsage = useKroniloStore(
		(s) => s.resetCronToNaturalUsage,
	);
	const resetNaturalToCronUsage = useKroniloStore(
		(s) => s.resetNaturalToCronUsage,
	);
	const canShowDonationModal = useKroniloStore((s) => s.canShowDonationModal);
	const setDismissedUntil = useKroniloStore((s) => s.setDismissedUntil);

	useEffect(() => {
		if (cronToNaturalUsageCount === 5 && canShowDonationModal()) {
			setDonationModalOpen(true);
			resetCronToNaturalUsage();
		}
	}, [
		cronToNaturalUsageCount,
		setDonationModalOpen,
		resetCronToNaturalUsage,
		canShowDonationModal,
	]);

	useEffect(() => {
		if (naturalToCronUsageCount === 2 && canShowDonationModal()) {
			setDonationModalOpen(true);
			resetNaturalToCronUsage();
		}
	}, [
		naturalToCronUsageCount,
		setDonationModalOpen,
		resetNaturalToCronUsage,
		canShowDonationModal,
	]);

	const handleFooterDonateClick = (e: React.MouseEvent) => {
		e.preventDefault();
		setDonationModalOpen(true);
	};

	const handleCloseModal = () => {
		setDonationModalOpen(false);
		resetCronToNaturalUsage();
		resetNaturalToCronUsage();
	};

	const handleMaybeLater = () => {
		const dismissUntil = new Date();
		dismissUntil.setDate(dismissUntil.getDate() + 14);
		setDismissedUntil(dismissUntil);
		setDonationModalOpen(false);
		resetCronToNaturalUsage();
		resetNaturalToCronUsage();
	};

	return {
		donationModalOpen,
		handleFooterDonateClick,
		handleCloseModal,
		handleMaybeLater,
	};
}
