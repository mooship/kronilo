import clsx from "clsx";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { useWindowSize } from "usehooks-ts";
import type { AppFooterProps } from "../../types/components";

export const AppFooter: FC<AppFooterProps> = ({ onDonateClick }) => {
	const { t } = useTranslation();
	const { width } = useWindowSize();
	const isSmallScreen = width < 640;

	return (
		<footer
			className={clsx(
				"w-full border-t",
				isSmallScreen ? "py-3" : "py-4 sm:py-6",
				"bg-gray-50 border-gray-200 rounded-b-lg dark:bg-neutral-900 dark:border-neutral-700",
			)}
		>
			<div className="text-center px-2 sm:px-0">
				<p
					className={clsx(
						isSmallScreen ? "text-xs" : "text-xs sm:text-base",
						"text-gray-800 dark:text-neutral-100",
					)}
				>
					{t("footer.builtWith")}{" "}
					<span
						className="text-emerald-700 dark:text-emerald-400"
						aria-hidden="true"
					>
						<span className="text-red-500 dark:text-red-400">♥</span>
					</span>{" "}
					{t("footer.inSouthAfrica")} ·{" "}
					<button
						type="button"
						className="underline text-violet-700 hover:text-violet-500 hover:no-underline transition-colors text-xs sm:text-base font-semibold cursor-pointer dark:text-violet-300 dark:hover:text-violet-400 min-w-10 min-h-10 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-400 dark:focus:ring-violet-500"
						onClick={onDonateClick}
					>
						{t("footer.support")} <span aria-hidden="true">☕</span>
					</button>{" "}
					·{" "}
					<a
						href="https://github.com/mooship/kronilo"
						target="_blank"
						rel="noopener noreferrer"
						className="underline text-emerald-700 hover:text-emerald-500 hover:no-underline transition-colors text-xs sm:text-base font-semibold dark:text-emerald-400 dark:hover:text-emerald-300"
					>
						{t("footer.github")}
					</a>
					<br />
					<span
						className={clsx(
							isSmallScreen ? "text-xs" : "text-xs sm:text-base",
							"text-gray-700 dark:text-neutral-300",
						)}
					>
						{t("footer.licensedUnder")}{" "}
						<a
							href="https://www.gnu.org/licenses/agpl-3.0.html"
							target="_blank"
							rel="noopener noreferrer"
							className="underline text-violet-700 hover:text-violet-500 hover:no-underline transition-colors text-xs sm:text-base font-semibold dark:text-violet-300 dark:hover:text-violet-400 min-w-10 min-h-10 px-2 py-1 inline-flex items-center justify-center rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-400 dark:focus:ring-violet-500"
						>
							{t("footer.agplLicense")}
						</a>
					</span>
				</p>
			</div>
		</footer>
	);
};
