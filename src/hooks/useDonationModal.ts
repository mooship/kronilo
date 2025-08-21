import { useEffect } from "react";
import type { UseDonationModal } from "../types/hooks";
import { useKroniloStore } from "./useKroniloStore";

/**
 * useDonationModal
 *
 * Hook that coordinates presentation logic for the donation modal. It
 * subscribes to the global store to open/close the modal based on usage
 * metrics (for example when a certain feature has been used N times).
 *
 * Returned handlers are safe to pass directly to UI controls.
 *
 * @returns {UseDonationModal} - an object with the following properties:
 * - donationModalOpen: whether the modal is currently open
 * - handleFooterDonateClick: click handler for footer donate button
 * - handleCloseModal: closes the modal and resets usage counters
 * - handleMaybeLater: dismisses the modal for 14 days
 */
export function useDonationModal(): UseDonationModal {
	const donationModalOpen = useKroniloStore((s) => s.donationModalOpen);
	const setDonationModalOpen = useKroniloStore((s) => s.setDonationModalOpen);
	const cronToNaturalUsageCount = useKroniloStore(
		(s) => s.cronToNaturalUsageCount,
	);
	const resetCronToNaturalUsage = useKroniloStore(
		(s) => s.resetCronToNaturalUsage,
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

	const handleFooterDonateClick = (e: React.MouseEvent) => {
		e.preventDefault();
		setDonationModalOpen(true);
	};

	const handleCloseModal = () => {
		setDonationModalOpen(false);
		resetCronToNaturalUsage();
	};

	const handleMaybeLater = () => {
		const dismissUntil = new Date();
		dismissUntil.setDate(dismissUntil.getDate() + 14);
		setDismissedUntil(dismissUntil);
		setDonationModalOpen(false);
		resetCronToNaturalUsage();
	};

	return {
		donationModalOpen,
		handleFooterDonateClick,
		handleCloseModal,
		handleMaybeLater,
	};
}
