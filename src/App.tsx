import { lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { useMedia, useWindowSize } from "react-use";
import { AppRouter } from "./AppRouter";
import { AppFooter } from "./components/AppFooter";
import { AppHeader } from "./components/AppHeader";
import { AppLayout, AppMain } from "./components/AppLayout";
import { CronInput } from "./components/CronInput";
import { CronTranslation } from "./components/CronTranslation";
import { NaturalLanguageToCron } from "./components/NaturalLanguageToCron";
import { NextRuns } from "./components/NextRuns";
import { useCronValidation } from "./hooks/useCronValidation";
import { useDonationModal } from "./hooks/useDonationModal";
import { useKroniloStore } from "./store";

const DonationModal = lazy(() =>
	import("./components/DonationModal").then((m) => ({
		default: m.DonationModal,
	})),
);

export function MainContent() {
	const cron = useKroniloStore((s) => s.cron);
	const { error } = useCronValidation(cron);
	const location = useLocation();

	return location.pathname === "/natural-language-to-cron" ? (
		<NaturalLanguageToCron />
	) : (
		<div className="p-0">
			<CronInput error={error} />
			<CronTranslation cron={cron} />
			<NextRuns cron={cron} disabled={!!error} />
		</div>
	);
}

function App() {
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
		<AppLayout prefersReducedMotion={prefersReducedMotion}>
			<Suspense fallback={null}>
				<DonationModal
					open={donationModalOpen}
					onClose={handleCloseModal}
					onMaybeLater={handleMaybeLater}
				/>
			</Suspense>
			<AppHeader isSmallScreen={isSmallScreen} />
			<AppMain>
				<AppRouter />
			</AppMain>
			<AppFooter onDonateClick={handleFooterDonateClick} />
		</AppLayout>
	);
}

export default App;
