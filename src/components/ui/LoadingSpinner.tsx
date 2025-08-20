import clsx from "clsx";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import type { LoadingSpinnerProps } from "../../types/components";

/**
 * LoadingSpinner
 *
 * Visual spinner with an optional message used during async loading states.
 * - `message` allows overriding the default localized loading text
 * - `minHeight` lets callers reserve vertical space to avoid layout jump
 *
 * Props
 * - message?: optional custom message to display
 * - minHeight?: CSS min-height for the spinner container
 */
const LoadingSpinner = ({
	message,
	minHeight = "400px",
}: LoadingSpinnerProps) => {
	const { t } = useTranslation();
	const displayMessage = message || t("loading.default");

	return (
		<div className="flex items-center justify-center" style={{ minHeight }}>
			<div className="flex flex-col items-center gap-4">
				<div className="relative">
					<div
						className={clsx(
							"w-12 h-12 border-4 rounded-full animate-spin",
							"border-gray-3 border-t-blue-9",
						)}
					></div>
					<div
						className={clsx(
							"absolute inset-0 w-12 h-12 border-4 border-transparent border-r-green-9 rounded-full animate-spin",
						)}
						style={{ animationDelay: "0.15s", animationDirection: "reverse" }}
					></div>
				</div>
				<p className={clsx("font-medium text-blue-9")}>{displayMessage}</p>
			</div>
		</div>
	);
};

export const MemoizedLoadingSpinner = memo(LoadingSpinner);
