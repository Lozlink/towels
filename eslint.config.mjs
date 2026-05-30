import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

/**
 * Flat ESLint config (ESLint 9+ / Next 16).
 *
 * Replaces the legacy `.eslintrc.json` that extended `next/core-web-vitals`.
 * `eslint-config-next/core-web-vitals` now ships a flat-config array, so we
 * spread it and tack on the project's ignore globs.
 */
const config = [
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts"],
  },
  ...nextCoreWebVitals,
  {
    rules: {
      // eslint-plugin-react-hooks v7 (bundled with eslint-config-next 16) adds
      // this rule. The two flagged call sites are deliberate, correct patterns:
      // a mount-time data fetch in the admin dashboard and an IntersectionObserver
      // fallback in Reveal. Keep the signal as a warning rather than rewrite
      // working effects during the framework upgrade.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
];

export default config;
