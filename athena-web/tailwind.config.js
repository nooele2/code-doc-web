// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class', // Enable dark mode via class strategy
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        surface: 'var(--surface)',
        border: 'var(--border)',
        input: 'var(--input)',
        code: 'var(--code)',
        primaryText: 'var(--primary-text)',
        secondaryText: 'var(--secondary-text)',
        highlight: 'var(--highlight)',
        codeText: 'var(--code-text)',
        theme: 'var(--theme)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #0dcd8d, #126EEE)',
      },
    },
  },
  plugins: [],
};
