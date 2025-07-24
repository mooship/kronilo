import { lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { useMediaQuery, useWindowSize } from "usehooks-ts";
import { AppRouter } from "./AppRouter";
import { AppFooter } from "./components/AppFooter";
import { AppHeader } from "./components/AppHeader";
import { AppLayout, AppMain } from "./components/AppLayout";
import { MemoizedCronInput } from "./components/CronInput";
import { MemoizedCronTranslation } from "./components/CronTranslation";
import { MemoizedLanguageSwitcher } from "./components/LanguageSwitcher";
import { NaturalLanguageToCron } from "./components/NaturalLanguageToCron";
import { MemoizedNextRuns } from "./components/NextRuns";
import { useCronValidation } from "./hooks/useCronValidation";
import { useDonationModal } from "./hooks/useDonationModal";
import { useKroniloStore } from "./stores/useKroniloStore";

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
			<MemoizedCronInput error={error} />
			<MemoizedCronTranslation cron={cron} />
			<MemoizedNextRuns cron={cron} disabled={!!error} />
		</div>
	);
}

function App() {
	const { width } = useWindowSize();
	const prefersReducedMotion = useMediaQuery(
		"(prefers-reduced-motion: reduce)",
	);
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
			<div className="flex flex-col items-center w-full">
				<div className="w-full flex justify-end px-4 pt-2">
					<MemoizedLanguageSwitcher />
				</div>
				<AppHeader isSmallScreen={isSmallScreen} />
			</div>
			<AppMain>
				<AppRouter />
			</AppMain>
			<AppFooter onDonateClick={handleFooterDonateClick} />
		</AppLayout>
	);
}

export default App;
