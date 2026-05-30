/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // Tailwind v4 ships its own PostCSS plugin and handles vendor prefixing via
    // Lightning CSS, so the standalone `autoprefixer` dependency is no longer needed.
    "@tailwindcss/postcss": {},
  },
};

export default config;
