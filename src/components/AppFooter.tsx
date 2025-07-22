import clsx from "clsx";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import type { AppFooterProps } from "../types/components";

export const AppFooter: FC<AppFooterProps> = ({ onDonateClick }) => {
	const { t } = useTranslation();

	return (
		<footer
			className={clsx(
				"w-full py-4 sm:py-6 border-t",
				"bg-gray-50 border-gray-200 rounded-b-lg dark:bg-neutral-900 dark:border-neutral-700",
			)}
		>
			<div className="text-center px-2 sm:px-0">
				<p
					className={clsx(
						"text-xs sm:text-base",
						"text-gray-800 dark:text-neutral-100",
					)}
				>
					{t("footer.builtWith")}{" "}
					<span
						className="text-gray-800 dark:text-neutral-100"
						aria-hidden="true"
					>
						<span className="text-red-500 dark:text-red-400">♥</span>
					</span>{" "}
					{t("footer.inSouthAfrica")} ·{" "}
					<button
						type="button"
						className="underline text-black hover:text-gray-700 hover:no-underline transition-colors text-xs sm:text-base font-semibold cursor-pointer dark:text-white dark:hover:text-gray-300 min-w-10 min-h-10 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
						onClick={onDonateClick}
					>
						{t("footer.support")} <span aria-hidden="true">☕</span>
					</button>{" "}
					·{" "}
					<a
						href="https://github.com/mooship/kronilo"
						target="_blank"
						rel="noopener noreferrer"
						className="underline text-black hover:text-gray-700 hover:no-underline transition-colors text-xs sm:text-base font-semibold dark:text-white dark:hover:text-gray-300"
					>
						{t("footer.github")}
					</a>
					<br />
					<span
						className={clsx(
							"text-xs sm:text-base",
							"text-gray-700 dark:text-neutral-300",
						)}
					>
						{t("footer.licensedUnder")}{" "}
						<a
							href="https://www.gnu.org/licenses/agpl-3.0.html"
							target="_blank"
							rel="noopener noreferrer"
							className="underline text-black hover:text-gray-700 hover:no-underline transition-colors text-xs sm:text-base font-semibold dark:text-white dark:hover:text-gray-300 min-w-10 min-h-10 px-2 py-1 inline-flex items-center justify-center rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
						>
							{t("footer.agplLicense")}
						</a>
					</span>
				</p>
			</div>
		</footer>
	);
};
