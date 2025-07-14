import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
	plugins: [react(), tailwindcss()],
	build: {
		cssCodeSplit: true,
		minify: "esbuild",
		target: "esnext",
		sourcemap: mode === "development",
		assetsInlineLimit: 4096,
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes("i18next") || id.includes("react-i18next")) {
						return "i18n";
					}

					if (id.includes("react-use") || id.includes("react-tooltip")) {
						return "react-utils";
					}

					if (id.includes("react-router")) {
						return "react-router";
					}

					if (id.includes("node_modules/react/") || id.includes("react-dom")) {
						return "react-core";
					}

					if (id.includes("cron-parser")) {
						return "cron-parser";
					}

					if (id.includes("cronstrue")) {
						return "cronstrue";
					}

					if (id.includes("zustand") || id.includes("ky")) {
						return "state-http";
					}

					if (id.includes("node_modules")) {
						return "vendor";
					}
				},
			},
		},
	},
}));
