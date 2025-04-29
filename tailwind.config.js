module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "anime-pink": "#ff9ff3",
        "anime-purple": "#f368e0",
        "anime-blue": "#48dbfb",
        "anime-text": "#5f27cd",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
}
