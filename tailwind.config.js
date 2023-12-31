/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  purge: {
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
    options: {
      safelist: [
        "border-r-black",
        "border-r-transparent",
        "border-t-black",
        "border-t-transparent",
        "border-b-black",
        "border-b-transparent",
        "border-l-black",
        "border-l-transparent",
      ],
    },
  },
};
