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
	const prefersDark = useMedia("(prefers-color-scheme: dark)");
	const prefersReducedMotion = useMedia("(prefers-reduced-motion: reduce)");
	const {
		donationModalOpen,
		handleFooterDonateClick,
		handleCloseModal,
		handleMaybeLater,
	} = useDonationModal();

	const isSmallScreen = width < 640;

	function handleCronChange(val: string) {
		setCron(val);
		clearError();
	}

	return (
		<div
			className={`min-h-screen bg-base-100 text-base-content flex flex-col ${
				prefersReducedMotion ? "" : "transition-colors duration-200"
			}`}
			data-theme={prefersDark ? "dark" : "light"}
		>
			<DonationModal
				open={donationModalOpen}
				onClose={handleCloseModal}
				onMaybeLater={handleMaybeLater}
			/>
			<header className="w-full pt-4 sm:pt-8 pb-2 sm:pb-3">
				<div className="w-full max-w-xs sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto text-center px-2 sm:px-0">
					<h1
						className={`font-bold text-primary mb-2 sm:mb-4 break-words leading-tight ${
							isSmallScreen ? "text-2xl" : "text-2xl xs:text-3xl sm:text-5xl"
						}`}
					>
						Kronilo
					</h1>
					<h2
						className={`text-base-content/90 mb-2 sm:mb-3 break-words leading-snug ${
							isSmallScreen ? "text-base" : "text-base xs:text-lg sm:text-2xl"
						}`}
					>
						Dead Simple Cron Translator
					</h2>
					<p
						className={`text-base-content/70 break-words ${
							isSmallScreen ? "text-sm" : "text-sm xs:text-base sm:text-lg"
						}`}
					>
						Translate cron expressions to plain English instantly
					</p>
				</div>
			</header>
			<main className="flex-1 flex flex-col items-center justify-center px-2 sm:px-6 pt-2 sm:pt-4 pb-4 sm:pb-12 lg:pb-16">
				<div className="w-full max-w-2xl mx-auto">
					<div className="card bg-base-200/50 shadow-2xl border border-base-300 rounded-lg sm:rounded-2xl px-2 sm:px-6 py-4 sm:py-8">
						<div className="card-body p-0">
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
			<footer className="w-full py-4 sm:py-6 bg-base-200/80 border-t border-base-300">
				<div className="text-center px-2 sm:px-0">
					<p className="text-xs sm:text-base text-base-content/60">
						Built with{" "}
						<span className="text-primary" aria-hidden="true">
							♥
						</span>{" "}
						in South Africa ·{" "}
						<button
							type="button"
							className="link link-hover link-primary font-medium"
							aria-label="Support Kronilo"
							onClick={handleFooterDonateClick}
						>
							Support Kronilo ☕
						</button>{" "}
						·{" "}
						<a
							href="https://github.com/mooship/kronilo"
							target="_blank"
							rel="noopener"
							className="link link-hover link-primary font-medium"
							aria-label="Kronilo GitHub Repository"
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
