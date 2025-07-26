import type { ReactNode } from "react";

export interface ActionButtonProps {
	label: string;
	className?: string;
}

export interface CopyButtonProps {
	value: string;
	className?: string;
	label?: string;
	disabled?: boolean;
}

export interface CronInputProps {
	error?: string | string[];
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

export type CronstrueType = typeof import("cronstrue");
