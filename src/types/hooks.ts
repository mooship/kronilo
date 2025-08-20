/**
 * Hook return shapes
 */
export interface UseCronValidation {
	error: import("./i18n").I18nCronError[] | undefined;
	clearError: () => void;
}

export interface UseDonationModal {
	donationModalOpen: boolean;
	handleFooterDonateClick: (e: React.MouseEvent) => void;
	handleCloseModal: () => void;
	handleMaybeLater: () => void;
}

export interface UsePressAnimation {
	isPressed: boolean;
	handlePressStart: () => void;
	handlePressEnd: () => void;
}
