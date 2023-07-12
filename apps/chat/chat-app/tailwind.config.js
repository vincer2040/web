/** @type {import('tailwindcss').Config} */
export default {
  content: [
      "./**/*.html",
      "./*.html",
      "../src/main.rs",
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

