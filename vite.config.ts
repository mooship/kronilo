import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => ({
	plugins: [
		react(),
		tailwindcss(),
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

					if (id.includes("franc")) {
						return "franc";
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
