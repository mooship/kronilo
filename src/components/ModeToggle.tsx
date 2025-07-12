import clsx from "clsx";
import type { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Toggle button component for switching between different application modes.
 * Allows users to switch between "Cron → English" and "English → Cron" conversion modes.
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
	const isEnglishToCron = location.pathname === "/english-to-cron";

	return (
		<button
			type="button"
			className={clsx(
				"ml-4 px-4 py-2 rounded-xl border font-medium transition-colors duration-200 text-base",
				isEnglishToCron
					? "bg-gray-200 text-gray-900 border border-gray-300 hover:bg-gray-300 focus:bg-gray-300"
					: "bg-gray-100 text-gray-900 border border-gray-200 hover:bg-gray-200 focus:bg-gray-200",
			)}
			onClick={() => navigate(isEnglishToCron ? "/" : "/english-to-cron")}
			aria-label={
				isEnglishToCron
					? "Switch to Cron → English"
					: "Switch to English → Cron"
			}
		>
			{isEnglishToCron ? "Cron → English" : "English → Cron"}
		</button>
	);
};
