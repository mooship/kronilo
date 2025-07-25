import clsx from "clsx";
import type { FC } from "react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

const ModeToggle: FC = () => {
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

export const MemoizedModeToggle = memo(ModeToggle);
