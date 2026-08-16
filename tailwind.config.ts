import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F8F0EA",
        ink: "#161616",
        orange: "#FF5011",
        violet: "#7F5CF9",
      },
      fontFamily: {
        display: ["var(--font-anton)"],
        sans: ["var(--font-jakarta)"],
      },
    },
  },
  plugins: [],
};

export default config;
