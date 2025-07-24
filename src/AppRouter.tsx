import type { FC } from "react";
import { lazy, Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { MainContent } from "./App";
import { MemoizedLoadingSpinner } from "./components/LoadingSpinner";

const NotFoundCard = lazy(() =>
	import("./components/NotFoundCard").then((m) => ({
		default: m.NotFoundCard,
	})),
);

export const AppRouter: FC = () => {
	return (
		<Router>
			<Suspense fallback={<MemoizedLoadingSpinner />}>
				<Routes>
					<Route path="/" element={<MainContent />} />
					<Route path="/natural-language-to-cron" element={<MainContent />} />
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
