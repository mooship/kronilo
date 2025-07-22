import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppLoader } from "./components/AppLoader";
import { initI18n } from "./i18n";
import { queryClient } from "./lib/queryClient";

const rootElement = document.getElementById("root");

if (rootElement) {
	initI18n()
		.then(() => {
			createRoot(rootElement).render(
				<StrictMode>
					<QueryClientProvider client={queryClient}>
						<Suspense fallback={<AppLoader />}>
							<App />
						</Suspense>
					</QueryClientProvider>
				</StrictMode>,
			);
			if ("serviceWorker" in navigator) {
				window.addEventListener("load", () => {
					import("virtual:pwa-register").then(({ registerSW }) => {
						registerSW({ immediate: true });
					});
				});
			}
		})
		.catch(() => {
			createRoot(rootElement).render(
				<StrictMode>
					<QueryClientProvider client={queryClient}>
						<Suspense fallback={<AppLoader />}>
							<App />
						</Suspense>
					</QueryClientProvider>
				</StrictMode>,
			);
		});
}
