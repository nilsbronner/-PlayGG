import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FFFFFF",
        surface: "#F4F5FC",
        ink: "#14141C",
        blue: "#2F3EE0",
        violet: "#8B4FF0",
        danger: "#E5335F",
      },
      fontFamily: {
        display: ["var(--font-arcade)"],
        sans: ["var(--font-jakarta)"],
      },
    },
  },
  plugins: [],
};

export default config;
