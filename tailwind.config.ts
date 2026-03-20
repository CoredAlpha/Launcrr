import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Outfit", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        bg: "#06080c",
        surface: "#0c1018",
        surface2: "#111827",
        border: "#1a2235",
        "border-hi": "#253352",
        dim: "#7a8ba8",
        muted: "#3e4f6a",
        accent: "#10b981",
      },
    },
  },
  plugins: [],
};
export default config;
