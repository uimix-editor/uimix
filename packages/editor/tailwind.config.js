import plugin from "tailwindcss/plugin.js";
import colors from "@uimix/foundation/src/colors.js";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../foundation/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        "2xs": "0.625rem", // 10px
        "macaron-base": ["var(--uimix-font-size, 0.75rem)", "1rem"],
      },
      colors: {
        macaron: colors,
      },
      aria: {
        invalid: 'invalid="true"',
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".contain-strict": {
          contain: "strict",
        },
      });
    }),
  ],
};
