import clsx from "clsx";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { useWindowSize } from "usehooks-ts";

export const AppHeader: FC = () => {
	const { t } = useTranslation();
	const { width } = useWindowSize();
	const isSmallScreen = width < 640;

	return (
		<header className="w-full pt-4 sm:pt-8 pb-2 sm:pb-3 relative">
			<div className="w-full max-w-xs sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto text-center px-2 sm:px-0">
				<h1
					className={clsx(
						"font-bold mb-2 sm:mb-4 break-words leading-tight",
						isSmallScreen ? "text-2xl" : "text-2xl xs:text-3xl sm:text-5xl",
						"text-emerald-700 dark:text-emerald-400",
					)}
					style={{ minHeight: isSmallScreen ? "2.5rem" : "3.5rem" }}
				>
					{t("app.title")}
				</h1>
				<h2
					className={clsx(
						"mb-2 sm:mb-3 break-words leading-snug",
						isSmallScreen ? "text-base" : "text-base xs:text-lg sm:text-2xl",
						"text-violet-700 dark:text-violet-300",
					)}
				>
					{t("app.subtitle")}
				</h2>
				<p
					className={clsx(
						"break-words",
						isSmallScreen ? "text-sm" : "text-sm xs:text-base sm:text-lg",
						"text-gray-700 dark:text-neutral-200",
					)}
				>
					{t("app.description")}
				</p>
			</div>
		</header>
	);
};
