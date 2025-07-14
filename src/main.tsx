import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppLoader } from "./components/AppLoader";
import { initI18n } from "./i18n";

/**
 * Application entry point that renders the React application.
 * Initializes the root React component with StrictMode for development safety checks.
 */
const rootElement = document.getElementById("root");

if (rootElement) {
	initI18n()
		.then(() => {
			createRoot(rootElement).render(
				<StrictMode>
					<Suspense fallback={<AppLoader />}>
						<App />
					</Suspense>
				</StrictMode>,
			);
		})
		.catch(() => {
			createRoot(rootElement).render(
				<StrictMode>
					<Suspense fallback={<AppLoader />}>
						<App />
					</Suspense>
				</StrictMode>,
			);
		});
}
