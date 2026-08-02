/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0F172A',
        'bg-secondary': '#111827',
        'bg-card': '#1E293B',
        'bg-card-hover': '#334155',
        'bg-sidebar': '#111827',
        'bg-navbar': '#111827',
        'accent-primary': '#10B981',
        'accent-hover': '#059669',
        'accent-active': '#047857',
        'accent-light': '#34D399',
        'accent-extralight': '#6EE7B7',
        'text-primary': '#F8FAFC',
        'text-secondary': '#CBD5E1',
        'text-muted': '#94A3B8',
        'border-color': 'rgba(255, 255, 255, 0.08)',
        'border-input': '#334155',
        'status-success': '#22C55E',
        'status-warning': '#F59E0B',
        'status-danger': '#EF4444',
        'status-info': '#3B82F6',
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
