/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0f172a',
          panel: '#111c33',
          border: '#1f2f52',
          cyan: '#22d3ee',
          red: '#ef4444',
          green: '#22c55e',
          yellow: '#f59e0b',
        },
      },
      boxShadow: {
        neon: '0 0 0 1px rgba(34,211,238,0.25), 0 0 24px rgba(34,211,238,0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};