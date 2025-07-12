/**
 * Return type for the useCronValidation hook.
 */
export interface UseCronValidation {
	error: string | undefined;
	clearError: () => void;
}

/**
 * Return type for the useDonationModal hook.
 */
export interface UseDonationModal {
	donationModalOpen: boolean;
	handleFooterDonateClick: (e: React.MouseEvent) => void;
	handleCloseModal: () => void;
	handleMaybeLater: () => void;
}

/**
 * Return type for the usePressAnimation hook.
 */
export interface UsePressAnimation {
	isPressed: boolean;
	handlePressStart: () => void;
	handlePressEnd: () => void;
}
