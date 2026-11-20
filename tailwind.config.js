/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./*.{js,jsx}"],
  corePlugins: { container: false },
  theme: {
    extend: {
      colors: {
        orange: { DEFAULT: "#ee4d2d", dark: "#d73211", light: "#f53d2d", tint: "#fff5f1" },
        page: "#f5f5f5",
        ink: "#222",
        muted: "#757575",
        line: "#e8e8e8",
      },
      fontFamily: {
        sans: ["Roboto", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
}

