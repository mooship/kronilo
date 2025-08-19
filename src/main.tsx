import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { MemoizedAppLoader } from "./components/layout/AppLoader";
import { initI18n } from "./i18n";
import { queryClient } from "./lib/queryClient";

const registerServiceWorker = () => {
	if ("serviceWorker" in navigator) {
		window.addEventListener("load", () => {
			import("virtual:pwa-register").then(({ registerSW }) => {
				registerSW({ immediate: true });
			});
		});
	}
};

const renderApp = () => {
	return (
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<Suspense fallback={<MemoizedAppLoader />}>
					<App />
				</Suspense>
				{import.meta.env?.MODE === "development" && (
					<ReactQueryDevtools initialIsOpen={false} />
				)}
			</QueryClientProvider>
		</StrictMode>
	);
};

const rootElement = document.getElementById("root");

if (rootElement) {
	const root = createRoot(rootElement);

	initI18n().then(() => {
		root.render(renderApp());
		registerServiceWorker();
	});
}
