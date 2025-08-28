import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { I18nCronError } from "./i18n";

export interface ExtendedActionButtonProps
	extends ActionButtonProps,
		ButtonHTMLAttributes<HTMLButtonElement> {}

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

export type CronstrueType = typeof import("cronstrue");
