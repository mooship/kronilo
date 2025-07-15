import clsx from "clsx";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Toggle button component for switching between different application modes.
 * Allows users to switch between "Cron → Natural language" and "Natural language → Cron" conversion modes.
 * Updates the current route and provides visual feedback for the active mode.
 *
 * @example
 * ```tsx
 * <ModeToggle />
 * // Displays current mode and allows switching between conversion directions
 * ```
 */
export const ModeToggle: FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const location = useLocation();
	const isNaturalLanguageToCron =
		location.pathname === "/natural-language-to-cron";

	return (
		<button
			type="button"
			className={clsx(
				"ml-4 rounded-xl border border-gray-200 bg-gray-100 px-4 py-2 font-medium text-base text-gray-900 transition-colors duration-200 hover:bg-gray-200 focus:bg-gray-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-50 dark:focus:bg-neutral-700 dark:hover:bg-neutral-700",
				"focus:shadow-lg focus:shadow-primary/30",
			)}
			onClick={() =>
				navigate(isNaturalLanguageToCron ? "/" : "/natural-language-to-cron")
			}
			aria-label={
				isNaturalLanguageToCron
					? t("navigation.switchMode.toCronToNatural")
					: t("navigation.switchMode.toNaturalToCron")
			}
		>
			{isNaturalLanguageToCron
				? t("navigation.modes.cronToNatural")
				: t("navigation.modes.naturalToCron")}
		</button>
	);
};
