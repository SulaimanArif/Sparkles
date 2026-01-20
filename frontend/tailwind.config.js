/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          dark: '#0a0e27',
          navy: '#1a1f3a',
          purple: '#6366f1',
          blue: '#3b82f6',
          cyan: '#06b6d4',
          pink: '#ec4899',
        },
      },
      backgroundImage: {
        'space-gradient': 'linear-gradient(to bottom, #0a0e27 0%, #1a1f3a 50%, #0a0e27 100%)',
        'nebula': 'radial-gradient(ellipse at top, #4c1d95 0%, #1e1b4b 50%, #0a0e27 100%)',
      },
    },
  },
  plugins: [],
}
