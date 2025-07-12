import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

/**
 * Vite configuration for the Kronilo application.
 * Configures React with SWC, Tailwind CSS, and optimizes the build process.
 */
export default defineConfig({
	plugins: [react(), tailwindcss()],
	build: {
		cssCodeSplit: true,
		minify: "esbuild",
		target: "esnext",
		modulePreload: { polyfill: false },
		manifest: true,
		sourcemap: false,
		assetsInlineLimit: 4096,
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes("react") || id.includes("react-dom")) {
						return "react-core";
					}

					if (
						id.includes("react-router") ||
						id.includes("react-icons") ||
						id.includes("react-tooltip") ||
						id.includes("react-use")
					) {
						return "react-ecosystem";
					}

					if (id.includes("cron-parser") || id.includes("cronstrue")) {
						return "cron-utils";
					}

					if (id.includes("zustand")) {
						return "state";
					}

					if (id.includes("tailwindcss") || id.includes("clsx")) {
						return "ui-utils";
					}

					if (id.includes("ky")) {
						return "network";
					}

					if (id.includes("node_modules")) {
						return "vendor";
					}
				},
			},
		},
	},
});
