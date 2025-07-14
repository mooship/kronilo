import type { FC } from "react";
import { lazy, Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { MainContent } from "./App";
import { LoadingSpinner } from "./components/LoadingSpinner";

const NotFoundCard = lazy(() =>
	import("./components/NotFoundCard").then((m) => ({
		default: m.NotFoundCard,
	})),
);

/**
 * Application router component that handles routing between different pages.
 * Defines routes for the main cron functionality and natural-language-to-cron conversion,
 * with a fallback 404 page for unmatched routes.
 *
 * @returns The router configuration with all application routes
 */
export const AppRouter: FC = () => {
	return (
		<Router>
			<Suspense fallback={<LoadingSpinner />}>
				<Routes>
					<Route path="/" element={<MainContent />} />
					<Route path="/natural-language-to-cron" element={<MainContent />} />
					<Route
						path="*"
						element={
							<Suspense fallback={<LoadingSpinner />}>
								<NotFoundCard />
							</Suspense>
						}
					/>
				</Routes>
			</Suspense>
		</Router>
	);
};
