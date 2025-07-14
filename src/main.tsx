import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n";
import App from "./App.tsx";
import { AppLoader } from "./components/AppLoader";

/**
 * Application entry point that renders the React application.
 * Initializes the root React component with StrictMode for development safety checks.
 */
const rootElement = document.getElementById("root");
if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<Suspense fallback={<AppLoader />}>
				<App />
			</Suspense>
		</StrictMode>,
	);
}
