/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./ui-src/**/*.{html,tsx,jsx,js,ts}"],
  theme: {
    extend: {},
  },
  plugins: [require("@thoughtbot/tailwindcss-aria-attributes")],
};
