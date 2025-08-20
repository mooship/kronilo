import type { FC } from "react";
import { lazy, Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { MainContent } from "./App";
import { MemoizedLoadingSpinner } from "./components/ui/LoadingSpinner";

const NotFoundCard = lazy(() =>
	import("./components/pages/NotFoundCard").then((m) => ({
		default: m.NotFoundCard,
	})),
);

/**
 * AppRouter
 *
 * Application router that defines top-level routes. The root path renders the
 * main cron UI while unknown paths render a lazily-loaded `NotFoundCard`.
 * Suspense fallbacks are provided to show a spinner while lazy chunks load.
 */
export const AppRouter: FC = () => {
	return (
		<Router>
			<Suspense fallback={<MemoizedLoadingSpinner />}>
				<Routes>
					<Route path="/" element={<MainContent />} />
					<Route
						path="*"
						element={
							<Suspense fallback={<MemoizedLoadingSpinner />}>
								<NotFoundCard />
							</Suspense>
						}
					/>
				</Routes>
			</Suspense>
		</Router>
	);
};
