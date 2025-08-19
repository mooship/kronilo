import { lazy, Suspense } from "react";
import { useMediaQuery } from "usehooks-ts";
import { AppRouter } from "./AppRouter";
import { MemoizedCronInput } from "./components/cron/CronInput";
import { MemoizedCronTranslation } from "./components/cron/CronTranslation";
import { MemoizedNextRuns } from "./components/cron/NextRuns";
import { AppFooter } from "./components/layout/AppFooter";
import { AppHeader } from "./components/layout/AppHeader";
import { AppLayout, AppMain } from "./components/layout/AppLayout";
import { MemoizedLanguageSwitcher } from "./components/ui/LanguageSwitcher";
import { useCronValidation } from "./hooks/useCronValidation";
import { useDonationModal } from "./hooks/useDonationModal";
import { useKroniloStore } from "./stores/useKroniloStore";

const DonationModal = lazy(() =>
	import("./components/ui/DonationModal").then((m) => ({
		default: m.DonationModal,
	})),
);

export function MainContent() {
	const cron = useKroniloStore((s) => s.cron);
	const { error } = useCronValidation(cron);

	return (
		<div className="p-0">
			<MemoizedCronInput error={error} />
			<MemoizedCronTranslation cron={cron} />
			<MemoizedNextRuns cron={cron} disabled={!!error} />
		</div>
	);
}

function App() {
	const prefersReducedMotion = useMediaQuery(
		"(prefers-reduced-motion: reduce)",
	);
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
				<AppHeader />
			</div>
			<AppMain>
				<AppRouter />
			</AppMain>
			<AppFooter onDonateClick={handleFooterDonateClick} />
		</AppLayout>
	);
}

export default App;
