/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        spectre: {
          bg: '#0f1419',
          surface: '#1a2332',
          accent: '#3b82f6',
          muted: '#94a3b8',
        },
      },
    },
  },
  plugins: [],
};
