import type { ReactNode } from "react";
import type { I18nCronError } from "./i18n";

/**
 * UI component prop types
 */
export interface ActionButtonProps {
	label: string;
	className?: string;
}

export interface CopyButtonProps {
	value: string;
	className?: string;
	label?: string;
	disabled?: boolean;
	size?: "sm" | "lg";
}

export interface CronInputProps {
	/**
	 * Validation error(s) for the cron input. Can be raw strings or
	 * i18n-friendly error objects.
	 */
	error?: string | string[] | I18nCronError[];
}

export interface CronTranslationProps {
	cron: string;
}

export interface DonationModalProps {
	open: boolean;
	onClose: () => void;
	onMaybeLater: () => void;
}

export interface NextRunsProps {
	cron: string;
	disabled?: boolean;
}

export interface LoadingSpinnerProps {
	message?: string;
	minHeight?: string;
}

export interface AppHeaderProps {
	isSmallScreen: boolean;
}

export interface AppFooterProps {
	onDonateClick: (e: React.MouseEvent) => void;
}

export interface AppLayoutProps {
	prefersReducedMotion: boolean;
	children: ReactNode;
}

export interface AppMainProps {
	children: ReactNode;
}

export interface AmbiguousScheduleWarningProps {
	show: boolean;
}

export interface NextRunsListProps {
	runs: string[];
	error: string | null;
	loading: boolean;
}

/**
 * Type of the dynamically-imported `cronstrue` module used by the translation
 * component.
 */
export type CronstrueType = typeof import("cronstrue");
