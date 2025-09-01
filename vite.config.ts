import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { FontaineTransform } from "fontaine";
import { defineConfig } from "vite";

const options = {
	fallbacks: [
		"Geist Variable",
		"Geist",
		"Inter",
		"-apple-system",
		"system-ui",
		"Segoe UI",
		"Roboto",
		"Helvetica Neue",
		"Arial",
		"sans-serif",
	],
	resolvePath: (id: string) => `file:/public/dir${id}`,
};

export default defineConfig(({ mode }) => ({
	plugins: [react(), tailwindcss(), FontaineTransform.vite(options)],
	build: {
		cssCodeSplit: true,
		minify: "esbuild",
		target: "esnext",
		sourcemap: mode === "development",
		assetsInlineLimit: 4096,
		rollupOptions: {
			output: {
				manualChunks(id: string) {
					if (id.includes("cron-parser")) {
						return "cron-parser";
					}
					if (id.includes("cronstrue")) {
						return "cronstrue";
					}
					if (id.includes("clsx")) {
						return "clsx";
					}
					if (id.includes("lucide-react") || id.includes("react-tooltip")) {
						return "react-visuals";
					}
					if (id.includes("usehooks-ts") || id.includes("radash")) {
						return "hooks-utils";
					}
					if (
						id.includes("i18next-http-backend") ||
						id.includes("i18next-browser-languagedetector")
					)
						return "i18n-plugins";
					if (id.includes("i18next") || id.includes("react-i18next")) {
						return "i18n";
					}
					if (id.includes("zustand")) {
						return "state";
					}
					if (id.includes("node_modules/react/") || id.includes("react-dom")) {
						return "react-core";
					}
					if (id.includes("react-router")) {
						return "react-router";
					}
					if (id.includes("zod")) {
						return "zod";
					}
					if (id.includes("node_modules")) {
						return "vendor";
					}
				},
			},
		},
		cacheDir: "node_modules/.vite_cache",
		incremental: true,
		clearScreen: false,
	},
	server: {
		fs: {
			strict: false,
		},
	},
}));
