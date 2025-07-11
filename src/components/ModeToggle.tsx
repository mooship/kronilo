import clsx from "clsx";
import { useLocation, useNavigate } from "react-router-dom";

export function ModeToggle() {
	const navigate = useNavigate();
	const location = useLocation();
	const isEnglishToCron = location.pathname === "/english-to-cron";

	return (
		<button
			type="button"
			className={clsx(
				"ml-4 flex items-center px-2 py-1 rounded-lg border font-medium transition-colors duration-200",
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
			<span className="font-medium text-sm">
				{isEnglishToCron ? "English" : "Cron"}
			</span>
			<span
				className={clsx(
					"mx-2 w-10 h-5 flex items-center bg-white border border-gray-300 rounded-full p-1 transition-colors duration-200 relative overflow-hidden",
				)}
			>
				<span
					className={clsx(
						"bg-gray-400 w-4 h-4 rounded-full shadow transform transition-transform duration-200 absolute top-1/2 -translate-y-1/2",
						isEnglishToCron ? "right-1" : "left-1",
					)}
				></span>
			</span>
			<span className="font-medium text-sm">
				{isEnglishToCron ? "Cron" : "English"}
			</span>
		</button>
	);
}
