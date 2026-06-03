/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        spectre: {
  accent: '#3b82f6',
  bg: '#0f1419',
  muted: '#94a3b8',
  surface: '#1a2332'
},
      },
    },
  },
  plugins: [],
};
