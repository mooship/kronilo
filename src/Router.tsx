import type { FC } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { MainContent } from "./App";
import { NotFoundCard } from "./components/NotFoundCard";

export const AppRouter: FC = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<MainContent />} />
				<Route path="/english-to-cron" element={<MainContent />} />
				<Route path="*" element={<NotFoundCard />} />
			</Routes>
		</Router>
	);
};
