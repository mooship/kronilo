import { useEffect } from "react";
import { useKroniloStore } from "../stores/useKroniloStore";
import type { UseDonationModal } from "../types/hooks";

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
