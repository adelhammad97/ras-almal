import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        deep: "#0b1220",
        panel: "#17263e",
        accent: "#2dd4bf",
        accent2: "#fbbf24",
        success: "#34d399",
        danger: "#f87171",
      },
      boxShadow: {
        game: "0 12px 30px rgba(0,0,0,0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
