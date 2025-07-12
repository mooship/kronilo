import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

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
					if (id.includes("node_modules")) {
						return "vendor";
					}
				},
			},
		},
	},
});
