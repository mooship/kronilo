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
	const usageCount = useKroniloStore((s) => s.usageCount);
	const resetUsage = useKroniloStore((s) => s.resetUsage);
	const canShowDonationModal = useKroniloStore((s) => s.canShowDonationModal);
	const setDismissedUntil = useKroniloStore((s) => s.setDismissedUntil);

	useEffect(() => {
		if (usageCount === 5 && canShowDonationModal()) {
			setDonationModalOpen(true);
			resetUsage();
		}
	}, [usageCount, setDonationModalOpen, resetUsage, canShowDonationModal]);

	const handleFooterDonateClick = (e: React.MouseEvent) => {
		e.preventDefault();
		setDonationModalOpen(true);
	};

	const handleCloseModal = () => {
		setDonationModalOpen(false);
		resetUsage();
	};

	const handleMaybeLater = () => {
		const dismissUntil = new Date();
		dismissUntil.setDate(dismissUntil.getDate() + 14);
		setDismissedUntil(dismissUntil);
		setDonationModalOpen(false);
		resetUsage();
	};

	return {
		donationModalOpen,
		handleFooterDonateClick,
		handleCloseModal,
		handleMaybeLater,
	};
}
