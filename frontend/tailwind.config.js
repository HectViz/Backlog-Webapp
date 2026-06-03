import daisyui from "daisyui"
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
        pressStart: ['"Press Start 2P"', 'monospace'],
      },
    },
  },
  plugins: [
    daisyui,
  ],
  daisyui: {
    themes: ["retro"],
  },
}
