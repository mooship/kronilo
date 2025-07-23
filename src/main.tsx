import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppLoader } from "./components/AppLoader";
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
				<Suspense fallback={<AppLoader />}>
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

	initI18n().finally(() => {
		root.render(renderApp());
		registerServiceWorker();
	});
}
