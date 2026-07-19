/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0D0D0D',
        'bg-secondary': '#171717',
        'bg-card': '#1F1F1F',
        'accent-primary': '#22C55E',
        'accent-secondary': '#16A34A',
        'accent-hover': '#4ADE80',
        'text-primary': '#FFFFFF',
        'text-secondary': '#A3A3A3',
        'border-color': 'rgba(255, 255, 255, 0.08)',
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'lg': '16px',
        'md': '14px',
        'sm': '12px',
      }
    },
  },
  plugins: [],
}
