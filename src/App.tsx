import { useEffect, useState } from "react";
import { CronInput } from "./components/CronInput";
import { CronTranslation } from "./components/CronTranslation";
import { DonationModal } from "./components/DonationModal";
import { NextRuns } from "./components/NextRuns";
import { useKroniloStore } from "./store";

function App() {
	const [cron, setCron] = useState("");
	const [error, setError] = useState<string | undefined>(undefined);
	const donationModalOpen = useKroniloStore((s) => s.donationModalOpen);
	const setDonationModalOpen = useKroniloStore((s) => s.setDonationModalOpen);
	const usageCount = useKroniloStore((s) => s.usageCount);
	const resetUsage = useKroniloStore((s) => s.resetUsage);
	const canShowDonationModal = useKroniloStore((s) => s.canShowDonationModal);
	const setDismissedUntil = useKroniloStore((s) => s.setDismissedUntil);

	// Debounce error checking to be less aggressive
	useEffect(() => {
		const timer = setTimeout(() => {
			if (cron.length > 100) {
				setError("Input too long (max 100 characters)");
			} else {
				setError(undefined);
			}
		}, 1000); // Wait 1 second before showing error

		return () => clearTimeout(timer);
	}, [cron]);

	useEffect(() => {
		if (usageCount === 5 && canShowDonationModal()) {
			setDonationModalOpen(true);
			resetUsage(); // Reset so modal doesn't trigger again
		}
	}, [usageCount, setDonationModalOpen, resetUsage, canShowDonationModal]);

	function handleCronChange(val: string) {
		setCron(val);
		// Clear immediate error when user is typing
		if (error && val.length <= 100) {
			setError(undefined);
		}
		// Removed automatic usage increment - will be handled by successful translations
	}

	function handleFooterDonateClick(e: React.MouseEvent) {
		e.preventDefault();
		setDonationModalOpen(true);
	}

	function handleCloseModal() {
		setDonationModalOpen(false);
		resetUsage(); // Reset usage count when modal is closed
	}

	function handleMaybeLater() {
		// Set dismiss date to 14 days from now
		const dismissUntil = new Date();
		dismissUntil.setDate(dismissUntil.getDate() + 14);
		setDismissedUntil(dismissUntil);
		setDonationModalOpen(false);
		resetUsage();
	}

	return (
		<div
			className="min-h-screen bg-base-100 text-base-content flex flex-col"
			data-theme="dracula"
		>
			<DonationModal
				open={donationModalOpen}
				onClose={handleCloseModal}
				onMaybeLater={handleMaybeLater}
			/>
			<header className="w-full py-8">
				<div className="text-center">
					<h1 className="text-5xl font-bold text-primary mb-4">Kronilo</h1>
					<h2 className="text-2xl text-base-content/90 mb-3">
						Dead Simple Cron Translator
					</h2>
					<p className="text-lg text-base-content/70">
						Translate cron expressions to plain English instantly
					</p>
				</div>
			</header>
			<main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
				<div className="w-full max-w-5xl">
					<div className="card bg-base-200/50 shadow-2xl border border-base-300">
						<div className="card-body p-8">
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
			<footer className="w-full py-6 bg-base-200/80 border-t border-base-300">
				<div className="text-center">
					<p className="text-base-content/60">
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
