/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          deepCharcoal: '#0B1120',
          charcoal: '#111827',
          panel: '#1E293B',
          amber: '#F59E0B',
          deepAmber: '#D97706',
          amberHighlight: '#FBBF24',
          slate: '#334155',
          muted: '#94A3B8',
          heading: '#E2E8F0',
          resolved: '#10B981',
          critical: '#EF4444',
          info: '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 2.5s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(-100%)', opacity: '0.2' },
          '50%': { transform: 'translateY(100%)', opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}
