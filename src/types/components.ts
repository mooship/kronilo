/**
 * Props for the ActionButton component.
 */
export interface ActionButtonProps {
	label: string;
	className?: string;
}

/**
 * Props for the CopyButton component.
 */
export interface CopyButtonProps {
	value: string;
	className?: string;
	label?: string;
	disabled?: boolean;
}

/**
 * Props for the CronInput component.
 */
export interface CronInputProps {
	error?: string;
}

/**
 * Props for the CronTranslation component.
 */
export interface CronTranslationProps {
	cron: string;
}

/**
 * Props for the DonationModal component.
 */
export interface DonationModalProps {
	open: boolean;
	onClose: () => void;
	onMaybeLater: () => void;
}

/**
 * Props for the NextRuns component.
 */
export interface NextRunsProps {
	cron: string;
	disabled?: boolean;
}

/**
 * Props for the LoadingSpinner component.
 */
export interface LoadingSpinnerProps {
	message?: string;
	minHeight?: string;
}
