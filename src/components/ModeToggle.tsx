import clsx from "clsx";
import type { FC } from "react";
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
	const navigate = useNavigate();
	const location = useLocation();
	const isNaturalLanguageToCron =
		location.pathname === "/natural-language-to-cron";

	return (
		<button
			type="button"
			className={clsx(
				"ml-4 px-4 py-2 rounded-xl border font-medium transition-colors duration-200 text-base",
				isNaturalLanguageToCron
					? "bg-gray-200 text-gray-900 border border-gray-300 hover:bg-gray-300 focus:bg-gray-300"
					: "bg-gray-100 text-gray-900 border border-gray-200 hover:bg-gray-200 focus:bg-gray-200",
			)}
			onClick={() =>
				navigate(isNaturalLanguageToCron ? "/" : "/natural-language-to-cron")
			}
			aria-label={
				isNaturalLanguageToCron
					? "Switch to Cron → Natural Language"
					: "Switch to Natural Language → Cron"
			}
		>
			{isNaturalLanguageToCron
				? "Cron → Natural Language"
				: "Natural Language → Cron"}
		</button>
	);
};
