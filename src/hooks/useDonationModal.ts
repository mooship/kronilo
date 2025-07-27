import { useEffect } from "react";
import { useKroniloStore } from "../stores/useKroniloStore";
import type { UseDonationModal } from "../types/hooks";

/**
 * React hook for managing the donation modal state and logic.
 * Handles open/close, usage counters, and dismiss logic for the modal.
 *
 * @returns {UseDonationModal} Modal state and action handlers
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

	/**
	 * Handler for clicking the donate button in the footer.
	 * @param e React mouse event
	 */
	const handleFooterDonateClick = (e: React.MouseEvent) => {
		e.preventDefault();
		setDonationModalOpen(true);
	};

	/**
	 * Handler for closing the donation modal.
	 */
	const handleCloseModal = () => {
		setDonationModalOpen(false);
		resetCronToNaturalUsage();
		resetNaturalToCronUsage();
	};

	/**
	 * Handler for dismissing the modal for 14 days.
	 */
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
