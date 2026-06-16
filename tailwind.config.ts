import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          card: "var(--bg-card)",
          dirt: "var(--bg-dirt)",
          grass: "var(--bg-grass)",
          stone: "var(--bg-stone)",
          nether: "var(--bg-nether)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          accent: "var(--text-accent)",
          gold: "var(--text-gold)",
          diamond: "var(--text-diamond)",
        },
        accent: {
          green: "var(--accent-green)",
          gold: "var(--accent-gold)",
          diamond: "var(--accent-diamond)",
          red: "var(--accent-red)",
          purple: "var(--accent-purple)",
          emerald: "var(--accent-emerald)",
        },
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
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      fontFamily: {
        pixel: ["var(--font-press-start)", "monospace"],
        retro: ["var(--font-vt323)", "monospace"],
        body: ["var(--font-nunito)", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        none: "0px",
      },
      boxShadow: {
        pixel: "var(--shadow-pixel)",
      },
      borderWidth: {
        pixel: "3px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
