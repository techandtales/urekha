import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"],
  plugins: [],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        brand: {
          gold: "#D4AF37", // True metallic gold
          bronze: "#A67A5B", // Coppery bronze
          velvet: "#0F0A0A", // Deep maroon black
          velvetLight: "#1A0E10", // Raised card background
          cream: "#F4F0EA", // Off-white elegant text
          white: "#ffffff",
          dark: "#080505", // The darkest shadow
        },
      },
      fontFamily: {
        sans: ["var(--font-roboto)", "var(--font-inter)", "var(--font-outfit)", "sans-serif"],
        serif: ["var(--font-cinzel)", "serif"],
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        mono: ["var(--font-source-code)", "monospace"],
      },
      animation: {
        marquee: "marquee 40s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
};
export default config;
