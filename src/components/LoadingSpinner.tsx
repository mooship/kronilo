import clsx from "clsx";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import type { LoadingSpinnerProps } from "../types/components";

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
							"border-violet-200 border-t-violet-700",
							"dark:border-violet-700 dark:border-t-emerald-400",
						)}
					></div>
					<div
						className={clsx(
							"absolute inset-0 w-12 h-12 border-4 border-transparent border-r-emerald-400 rounded-full animate-spin",
							"dark:border-r-emerald-400",
						)}
						style={{ animationDelay: "0.15s", animationDirection: "reverse" }}
					></div>
				</div>
				<p
					className={clsx("font-medium text-violet-700 dark:text-emerald-400")}
				>
					{displayMessage}
				</p>
			</div>
		</div>
	);
};

export const MemoizedLoadingSpinner = memo(LoadingSpinner);
