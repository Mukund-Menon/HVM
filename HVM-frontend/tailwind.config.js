/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily:{
        Heading:['IBM Plex Sans', 'sans-serif'],
      },
      colors: {
        amritaOrange: "#F58220",
      },
    },
  },
  plugins: [],
};
