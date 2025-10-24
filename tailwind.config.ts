import { frostedThemePlugin } from "@whop/react/tailwind";
import type { Config } from "tailwindcss";

export default {
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: "#FF6B35",
					light: "#FF8555",
					dark: "#E65420",
					bright: "#FF7F50",
					text: "#1F2937", // Dark gray for readable text
				},
				secondary: {
					DEFAULT: "#7B2CBF",
					light: "#9D4EDD",
					dark: "#5A189A",
				},
				accent: {
					DEFAULT: "#EC4899",
					light: "#F472B6",
					dark: "#DB2777",
				},
				info: {
					DEFAULT: "#06B6D4",
					light: "#22D3EE",
					dark: "#0891B2",
				},
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			fontFamily: {
				hegarty: ["var(--font-hegarty)", "sans-serif"],
				arimo: ["var(--font-arimo)", "sans-serif"],
			},
		},
	},
	plugins: [frostedThemePlugin()],
} satisfies Config;
