import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { MemoizedAppLoader } from "./components/layout/AppLoader";
import { initI18n } from "./i18n";

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
			<Suspense fallback={<MemoizedAppLoader />}>
				<App />
			</Suspense>
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
