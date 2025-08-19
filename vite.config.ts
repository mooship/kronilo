import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { FontaineTransform } from "fontaine";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const options = {
	fallbacks: [
		"Poppins",
		"Poppins Variable",
		"Inter",
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
	plugins: [
		react(),
		tailwindcss(),
		FontaineTransform.vite(options),
		VitePWA({
			registerType: "autoUpdate",
			manifest: {
				name: "Kronilo",
				short_name: "Kronilo",
				icons: [
					{
						src: "/android-chrome-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "/android-chrome-512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
				],
				theme_color: "#171717",
				background_color: "#171717",
				display: "standalone",
			},
			devOptions: {
				enabled: mode === "development",
			},
		}),
	],
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
					if (id.includes("@tanstack/react-query-devtools")) {
						return "react-query-devtools";
					}
					if (id.includes("clsx")) {
						return "clsx";
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
					if (id.includes("@tanstack/react-query")) {
						return "react-query";
					}
					if (id.includes("usehooks-ts") || id.includes("react-tooltip")) {
						return "react-utils";
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
