import type { Config } from "tailwindcss";

/**
 * Saltmist brand theme.
 * Palette ported faithfully from the static storefront's CSS custom properties.
 * Solid hex values are exposed as named colours; the ink/* alpha tints map to the
 * rgba(46,42,36, …) values used throughout the source.
 */
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bone: {
          DEFAULT: "#F4EFE6",
          2: "#FBF8F2",
        },
        ink: {
          DEFAULT: "#2E2A24",
          70: "rgba(46,42,36,0.70)",
          55: "rgba(46,42,36,0.55)",
          40: "rgba(46,42,36,0.40)",
        },
        terracotta: {
          DEFAULT: "#C8754B",
          dk: "#B0623B",
        },
        sand: {
          DEFAULT: "#D8C7AE",
          soft: "#E7DDCB",
        },
        mist: {
          DEFAULT: "#8FA3A0",
          soft: "#B8C4C1",
        },
        kelp: "#3F4A45",
        line: {
          DEFAULT: "rgba(46,42,36,0.12)",
          soft: "rgba(46,42,36,0.07)",
        },
      },
      fontFamily: {
        // Wired to the next/font CSS variables exposed in app/layout.tsx.
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        brand: "14px",
        "brand-lg": "22px",
      },
      maxWidth: {
        wrap: "1200px",
      },
      boxShadow: {
        "brand-sm":
          "0 1px 3px rgba(46,42,36,0.06), 0 6px 16px rgba(46,42,36,0.05)",
        "brand-md": "0 8px 30px rgba(46,42,36,0.10)",
        "brand-lg": "0 24px 60px rgba(46,42,36,0.16)",
        cta: "0 6px 20px rgba(200,117,75,0.32)",
        "cta-hover": "0 12px 28px rgba(200,117,75,0.40)",
      },
      transitionTimingFunction: {
        brand: "cubic-bezier(.2,.7,.25,1)",
      },
      keyframes: {
        floatY: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-7px)" },
        },
      },
      animation: {
        floatY: "floatY 7s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
