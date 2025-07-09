import { useEffect } from "react";
import { useKroniloStore } from "../store";

export function useDonationModal() {
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
