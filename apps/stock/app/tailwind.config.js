/** @type {import('tailwindcss').Config} */
export default {
  content: [
      "./**/*.html",
      "./*.html",
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

