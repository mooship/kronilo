import clsx from "clsx";
import { useLocalStorage, useMedia, useWindowSize } from "react-use";
import { CronInput } from "./components/CronInput";
import { CronTranslation } from "./components/CronTranslation";
import { DonationModal } from "./components/DonationModal";
import { NextRuns } from "./components/NextRuns";
import { useCronValidation } from "./hooks/useCronValidation";
import { useDonationModal } from "./hooks/useDonationModal";

function App() {
	const [cronRaw, setCron] = useLocalStorage<string>("kronilo-cron", "");
	const cron = cronRaw ?? "";
	const { error, clearError } = useCronValidation(cron);
	const { width } = useWindowSize();
	const prefersReducedMotion = useMedia("(prefers-reduced-motion: reduce)");
	const isSmallScreen = width < 640;

	const {
		donationModalOpen,
		handleFooterDonateClick,
		handleCloseModal,
		handleMaybeLater,
	} = useDonationModal();

	function handleCronChange(val: string) {
		setCron(val);
		clearError();
	}

	return (
		<div
			className={clsx(
				"min-h-screen flex flex-col",
				!prefersReducedMotion && "transition-colors duration-200",
				"bg-light-background text-light-foreground",
			)}
		>
			<DonationModal
				open={donationModalOpen}
				onClose={handleCloseModal}
				onMaybeLater={handleMaybeLater}
			/>
			<header className="w-full pt-4 sm:pt-8 pb-2 sm:pb-3 relative">
				<div className="w-full max-w-xs sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto text-center px-2 sm:px-0">
					<h1
						className={clsx(
							"font-bold mb-2 sm:mb-4 break-words leading-tight",
							isSmallScreen ? "text-2xl" : "text-2xl xs:text-3xl sm:text-5xl",
							"text-light-primary",
						)}
					>
						Kronilo
					</h1>
					<h2
						className={clsx(
							"mb-2 sm:mb-3 break-words leading-snug",
							isSmallScreen ? "text-base" : "text-base xs:text-lg sm:text-2xl",
							"text-light-foreground/90",
						)}
					>
						Dead Simple Cron Translator
					</h2>
					<p
						className={clsx(
							"break-words",
							isSmallScreen ? "text-sm" : "text-sm xs:text-base sm:text-lg",
							"text-light-foreground/70",
						)}
					>
						Translate cron expressions to plain English instantly
					</p>
				</div>
			</header>
			<main className="flex-1 flex flex-col items-center justify-center px-2 sm:px-6 pt-2 sm:pt-4 pb-4 sm:pb-12 lg:pb-16">
				<div className="w-full max-w-2xl mx-auto">
					<div
						className={clsx(
							"shadow-2xl border rounded-lg sm:rounded-2xl px-2 sm:px-6 py-4 sm:py-8",
							"bg-light-muted border-light-border",
						)}
					>
						<div className="p-0">
							<CronInput
								value={cron}
								onChange={handleCronChange}
								error={error}
							/>
							<CronTranslation cron={cron} />
							<NextRuns cron={cron} disabled={!!error} />
						</div>
					</div>
				</div>
			</main>
			<footer
				className={clsx(
					"w-full py-4 sm:py-6 border-t",
					"bg-light-muted border-light-border",
				)}
			>
				<div className="text-center px-2 sm:px-0">
					<p
						className={clsx("text-xs sm:text-base", "text-light-foreground/60")}
					>
						Built with{" "}
						<span className="text-light-primary" aria-hidden="true">
							♥
						</span>{" "}
						in South Africa ·{" "}
						<button
							type="button"
							className="underline text-light-primary hover:text-light-foreground hover:no-underline transition-colors text-xs sm:text-base font-semibold cursor-pointer"
							onClick={handleFooterDonateClick}
						>
							Support Kronilo <span aria-hidden="true">☕</span>
						</button>{" "}
						·{" "}
						<a
							href="https://github.com/mooship/kronilo"
							target="_blank"
							rel="noopener noreferrer"
							className="underline text-light-primary hover:text-light-foreground hover:no-underline transition-colors text-xs sm:text-base font-semibold"
						>
							GitHub
						</a>
					</p>
				</div>
			</footer>
		</div>
	);
}

export default App;
