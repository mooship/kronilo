module.exports = {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: [
					"Poppins",
					"system-ui",
					"Avenir",
					"Helvetica",
					"Arial",
					"sans-serif",
				],
			},
		},
	},
	plugins: [require("daisyui")],
	daisyui: {
		themes: ["light", "dark"],
	},
};
