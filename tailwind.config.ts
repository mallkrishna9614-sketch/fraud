import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        panel: "rgba(18, 24, 40, 0.65)",
        neonBlue: "#3aa6ff",
        neonRed: "#ff4d6d",
        neonGreen: "#22c55e"
      },
      boxShadow: {
        glowBlue: "0 0 20px rgba(58, 166, 255, 0.35)",
        glowRed: "0 0 20px rgba(255, 77, 109, 0.35)"
      },
      backdropBlur: {
        xs: "2px"
      }
    }
  },
  plugins: []
};

export default config;
