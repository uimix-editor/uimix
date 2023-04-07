import plugin from "tailwindcss/plugin.js";
import colors from "./src/colors.js";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        "2xs": "0.625rem", // 10px
        "macaron-base": ["12px", "16px"],
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
