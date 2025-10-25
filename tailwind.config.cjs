/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#0F0F0F",
        secondary: "#9ca3af",
        tertiary: "#1f2937",
        "black-100": "#0f0f0f",
        "black-200": "#1a1a1a",
        "white-100": "#f3f3f3",
        "blue-primary": "#1E3A8A",
        "blue-secondary": "#1e40af",
      },
      boxShadow: {
        card: "0px 35px 120px -15px #211e35",
      },
      screens: {
        xs: "450px",
      },
      backgroundImage: {
        "hero-pattern": "url('/src/assets/herobg.png')",
      },
    },
  },
  plugins: [],
};
