export interface UseCronValidation {
	error: string | undefined;
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
