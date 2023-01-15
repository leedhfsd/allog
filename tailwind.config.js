const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        eng: ["var(--font-oswald)", ...fontFamily.sans],
        kor: ["var(--font-notoSansKR)", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};
