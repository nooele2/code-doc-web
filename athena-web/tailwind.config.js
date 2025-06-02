/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#2b2d31',
        surface: '#323438',
        border: '#4b4b4b',
        input: '#3a3d41',
        code: '#282c34',
        primaryText: '#f0f0f0',
        secondaryText: '#bcbcbc',
        highlight: '#2f65ff',
        codeText: '#00ffaa',
      },
    },
  },
  plugins: [],
}
