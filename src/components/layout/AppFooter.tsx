import clsx from "clsx";
import { Heart } from "lucide-react";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { useWindowSize } from "usehooks-ts";
import type { AppFooterProps } from "../../types/components";

/**
 * AppFooter
 *
 * Page footer used across the application. Renders build attribution, license
 * link, GitHub link and a donate/support button. The layout adapts to window
 * size (small screens show compact text).
 *
 * Props
 * @param {(e: React.MouseEvent<HTMLButtonElement>) => void} onDonateClick -
 * callback invoked when the donate/support button is clicked.
 *
 * Accessibility: interactive elements use focus outlines and descriptive
 * labels so keyboard and screen reader users can operate them.
 */
export const AppFooter: FC<AppFooterProps> = ({ onDonateClick }) => {
	const { t } = useTranslation();
	const { width } = useWindowSize();
	const isSmallScreen = width < 640;

	return (
		<footer
			className={clsx(
				"w-full border-t",
				isSmallScreen ? "py-3" : "py-4 sm:py-6",
				"bg-background-secondary border-border rounded-b-lg",
			)}
		>
			<div className="text-center px-2 sm:px-0">
				<p
					className={clsx(
						isSmallScreen ? "text-xs" : "text-xs sm:text-base",
						"text-foreground",
					)}
				>
					{t("footer.builtWith")}{" "}
					<Heart
						className={clsx("inline-block w-4 h-4 align-middle text-red-6")}
						fill="currentColor"
						stroke="none"
						aria-hidden="true"
					/>{" "}
					{t("footer.inSouthAfrica")} ·{" "}
					<button
						type="button"
						className="underline text-blue-6 hover:text-blue-7 hover:no-underline transition-colors text-xs sm:text-base font-semibold cursor-pointer min-w-10 min-h-10 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-6 focus:ring-offset-background"
						onClick={onDonateClick}
					>
						{t("footer.support")} <span aria-hidden="true">☕</span>
					</button>{" "}
					·{" "}
					<a
						href="https://github.com/mooship/kronilo"
						target="_blank"
						rel="noopener noreferrer"
						className="underline text-green-6 hover:text-green-7 hover:no-underline transition-colors text-xs sm:text-base font-semibold"
					>
						{t("footer.github")}
					</a>
					<br />
					<span
						className={clsx(
							isSmallScreen ? "text-xs" : "text-xs sm:text-base",
							"text-foreground-secondary",
						)}
					>
						{t("footer.licensedUnder")}{" "}
						<a
							href="https://www.gnu.org/licenses/agpl-3.0.html"
							target="_blank"
							rel="noopener noreferrer"
							className="underline text-blue-9 hover:text-blue-10 hover:no-underline transition-colors text-xs sm:text-base font-semibold min-w-10 min-h-10 px-2 py-1 inline-flex items-center justify-center rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-8 focus:ring-offset-background"
						>
							{t("footer.agplLicense")}
						</a>
					</span>
				</p>
			</div>
		</footer>
	);
};
