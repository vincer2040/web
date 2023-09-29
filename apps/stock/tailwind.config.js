/** @type {import('tailwindcss').Config} */
export default {
  content: [
      "./**/*.html",
      "./*.html",
      "./**/*.ts",
      "./**/*.tsx",
  ],
  theme: {
    extend: {
        spacing: {
            'par': '70ch',
        }
    },
  },
  plugins: [],
}

