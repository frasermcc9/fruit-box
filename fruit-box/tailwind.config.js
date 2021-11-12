module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  mode: "jit",
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      gridTemplateColumns: {
        20: "repeat(20, 1fr)",
      },
      gridTemplateRows: {
        10: "repeat(10, 1fr)",
      },
      colors: {
        dark: {
          400: "#3c3d42",
          600: "#232526",
          800: "#18191a",
        },
      },
      screens: {
        xs: "480px",
      },
    },
  },
  variants: {},
  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
    require("tailwindcss-textshadow"),
  ],
};
