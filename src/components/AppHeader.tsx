import clsx from "clsx";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import type { AppHeaderProps } from "../types/components";

export const AppHeader: FC<AppHeaderProps> = ({ isSmallScreen }) => {
	const { t } = useTranslation();

	return (
		<header className="w-full pt-4 sm:pt-8 pb-2 sm:pb-3 relative">
			<div className="w-full max-w-xs sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto text-center px-2 sm:px-0">
				<h1
					className={clsx(
						"font-bold mb-2 sm:mb-4 break-words leading-tight",
						isSmallScreen ? "text-2xl" : "text-2xl xs:text-3xl sm:text-5xl",
						"text-black dark:text-neutral-50",
					)}
					style={{ minHeight: isSmallScreen ? "2.5rem" : "3.5rem" }}
				>
					{t("app.title")}
				</h1>
				<h2
					className={clsx(
						"mb-2 sm:mb-3 break-words leading-snug",
						isSmallScreen ? "text-base" : "text-base xs:text-lg sm:text-2xl",
						"text-black opacity-90 dark:text-neutral-50 dark:opacity-90",
					)}
				>
					{t("app.subtitle")}
				</h2>
				<p
					className={clsx(
						"break-words",
						isSmallScreen ? "text-sm" : "text-sm xs:text-base sm:text-lg",
						"text-black opacity-70 dark:text-neutral-50 dark:opacity-70",
					)}
				>
					{t("app.description")}
				</p>
			</div>
		</header>
	);
};
