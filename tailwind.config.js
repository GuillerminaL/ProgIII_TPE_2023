/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0f',
        surface: '#12121a',
        'surface-2': '#1a1a2e',
        border: '#2a2a3e',
        primary: '#6366f1',
        accent: '#22d3ee',
        success: '#4ade80',
        warning: '#fb923c',
        info: '#60a5fa',
        purple: '#a78bfa',
        'text-primary': '#f1f5f9',
        'text-secondary': '#94a3b8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(99, 102, 241, 0.7)' },
          '70%': { boxShadow: '0 0 0 12px rgba(99, 102, 241, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(99, 102, 241, 0)' },
        },
        'pulse-ring-end': {
          '0%': { boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.7)' },
          '70%': { boxShadow: '0 0 0 12px rgba(239, 68, 68, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(239, 68, 68, 0)' },
        },
        'dash-flow': {
          to: { strokeDashoffset: '-20' },
        },
        'glow-pulse': {
          '0%, 100%': { filter: 'drop-shadow(0 0 4px rgba(74, 222, 128, 0.8))' },
          '50%': { filter: 'drop-shadow(0 0 10px rgba(74, 222, 128, 1))' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'grow-bar': {
          from: { transform: 'scaleY(0)' },
          to: { transform: 'scaleY(1)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        'pulse-ring': 'pulse-ring 1.5s infinite',
        'pulse-ring-end': 'pulse-ring-end 1.5s infinite',
        'dash-flow': 'dash-flow 1s linear infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.3s ease-out',
        'grow-bar': 'grow-bar 0.8s ease-out forwards',
        'gradient-shift': 'gradient-shift 8s ease infinite',
      },
    },
  },
  plugins: [],
};
