/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#202225',
        surface: '#252526',
        border: '#3a3a3a',
        input: '#2a2d30',
        code: '#1e1e1e',
        primaryText: '#e5e5e5',
        secondaryText: '#a0a0a0',
        highlight: '#1B56FD',
        codeText: '#00FF88',
      },
    },
  },
  plugins: [],
}
