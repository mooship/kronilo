import clsx from "clsx";
import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useMedia, useWindowSize } from "react-use";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { useCronValidation } from "./hooks/useCronValidation";
import { useDonationModal } from "./hooks/useDonationModal";
import { AppRouter } from "./Router";
import { useKroniloStore } from "./store";

const CronInput = lazy(() =>
	import("./components/CronInput").then((m) => ({ default: m.CronInput })),
);
const CronTranslation = lazy(() =>
	import("./components/CronTranslation").then((m) => ({
		default: m.CronTranslation,
	})),
);
const DonationModal = lazy(() =>
	import("./components/DonationModal").then((m) => ({
		default: m.DonationModal,
	})),
);
const NaturalLanguageToCron = lazy(() =>
	import("./components/NaturalLanguageToCron").then((m) => ({
		default: m.NaturalLanguageToCron,
	})),
);
const NextRuns = lazy(() =>
	import("./components/NextRuns").then((m) => ({ default: m.NextRuns })),
);

/**
 * Main content component that renders different views based on the current route.
 * Displays either the Natural-Language-to-Cron converter or the standard Cron-to-Natural-Language interface.
 *
 * @returns The main content area with appropriate components based on current route
 */
export function MainContent() {
	const { t } = useTranslation();
	const cron = useKroniloStore((s) => s.cron);
	const { error } = useCronValidation(cron);
	const location = useLocation();

	return (
		<Suspense
			fallback={
				<LoadingSpinner message={t("loading.mode")} minHeight="200px" />
			}
		>
			{location.pathname === "/natural-language-to-cron" ? (
				<NaturalLanguageToCron />
			) : (
				<div className="p-0">
					<CronInput error={error} />
					<CronTranslation cron={cron} />
					<NextRuns cron={cron} disabled={!!error} />
				</div>
			)}
		</Suspense>
	);
}

/**
 * Root application component that provides the main layout and structure.
 * Handles responsive design, accessibility preferences, and manages the donation modal.
 *
 * @returns The complete application layout with header, main content, and footer
 */
function App() {
	const { t } = useTranslation();
	const { width } = useWindowSize();
	const prefersReducedMotion = useMedia("(prefers-reduced-motion: reduce)");
	const isSmallScreen = width < 640;
	const {
		donationModalOpen,
		handleFooterDonateClick,
		handleCloseModal,
		handleMaybeLater,
	} = useDonationModal();

	return (
		<div
			className={clsx(
				"min-h-screen flex flex-col",
				!prefersReducedMotion && "transition-colors duration-200",
				"bg-gray-50 text-black dark:bg-neutral-900 dark:text-neutral-50",
			)}
		>
			<Suspense fallback={null}>
				<DonationModal
					open={donationModalOpen}
					onClose={handleCloseModal}
					onMaybeLater={handleMaybeLater}
				/>
			</Suspense>
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
			<main className="flex-1 flex flex-col items-center justify-center px-2 sm:px-6 pt-0 sm:pt-2 pb-1 sm:pb-6 lg:pb-8 min-h-0 mb-1 sm:mb-0">
				<div className="w-full max-w-3xl mx-auto">
					<div
						className={clsx(
							"shadow-2xl border rounded-xl sm:rounded-2xl px-2 sm:px-6 py-2 sm:py-8",
							"bg-white border-gray-200 dark:bg-neutral-800 dark:border-neutral-700",
						)}
						style={{ minHeight: "600px" }}
					>
						<AppRouter />
					</div>
				</div>
			</main>
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
							onClick={handleFooterDonateClick}
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
		</div>
	);
}

export default App;
