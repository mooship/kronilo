import { useEffect } from "react";
import { useKroniloStore } from "../stores/useKroniloStore";
import type { UseDonationModal } from "../types/hooks";

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
