import type { FC } from "react";
import { useTranslation } from "react-i18next";
import type { LoadingSpinnerProps } from "../types/components";

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({
	message,
	minHeight = "400px",
}) => {
	const { t } = useTranslation();
	const displayMessage = message || t("loading.default");

	return (
		<div className="flex items-center justify-center" style={{ minHeight }}>
			<div className="flex flex-col items-center gap-4">
				<div className="relative">
					<div className="w-12 h-12 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin dark:border-neutral-700 dark:border-t-neutral-300"></div>
					<div
						className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-gray-400 rounded-full animate-spin dark:border-r-neutral-500"
						style={{ animationDelay: "0.15s", animationDirection: "reverse" }}
					></div>
				</div>
				<p className="text-gray-600 dark:text-neutral-400 font-medium">
					{displayMessage}
				</p>
			</div>
		</div>
	);
};
