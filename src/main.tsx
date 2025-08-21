import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { StrictMode, Suspense } from "react";
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

const devToolsInit: Promise<void> =
	import.meta.env.MODE === "development" && typeof window !== "undefined"
		? import("@welldone-software/why-did-you-render")
				.then((mod) => {
					const whyDidYouRender =
						(
							mod as unknown as {
								default?: (
									r: typeof React,
									opts?: Record<string, unknown>,
								) => void;
							}
						).default ||
						(mod as unknown as (
							r: typeof React,
							opts?: Record<string, unknown>,
						) => void);
					whyDidYouRender(React, {
						trackAllPureComponents: true,
						trackHooks: true,
						logOwnerReasons: true,
					});
				})
				.catch(() => {})
		: Promise.resolve();

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

	// Wait for both i18n initialization and dev tools init (if any)
	Promise.all([initI18n(), devToolsInit]).then(() => {
		root.render(renderApp());
		registerServiceWorker();
	});
}
