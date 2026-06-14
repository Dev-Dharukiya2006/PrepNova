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
        // Aurora gradient palette: purple → blue → cyan → teal
        aurora: {
          purple: '#8B5CF6',
          violet: '#7C3AED',
          blue: '#3B82F6',
          indigo: '#4F46E5',
          cyan: '#06B6D4',
          teal: '#14B8A6',
          pink: '#EC4899',
        },
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        secondary: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        dark: {
          50: '#f0f4ff',
          100: '#e1e9ff',
          200: '#c3d3ff',
          300: '#8fa8f8',
          400: '#6683e8',
          500: '#4a5fa8',
          600: '#3a4a8a',
          700: '#1e2a5a',
          800: '#111827',
          850: '#0d1224',
          900: '#080d1a',
          950: '#040810',
        },
        success: { 500: '#10b981', 600: '#059669' },
        warning: { 500: '#f59e0b', 600: '#d97706' },
        error: { 500: '#ef4444', 600: '#dc2626' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'aurora': 'linear-gradient(135deg, #8B5CF6 0%, #4F46E5 25%, #3B82F6 50%, #06B6D4 75%, #14B8A6 100%)',
        'aurora-dark': 'linear-gradient(135deg, #6D28D9 0%, #3730A3 25%, #1D4ED8 50%, #0E7490 75%, #0D9488 100%)',
        'aurora-soft': 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(79,70,229,0.15) 25%, rgba(59,130,246,0.15) 50%, rgba(6,182,212,0.15) 75%, rgba(20,184,166,0.15) 100%)',
        'card-glow': 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(6,182,212,0.08) 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'gradient': 'gradient 8s ease infinite',
        'aurora-flow': 'aurora-flow 12s ease infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'aurora-flow': {
          '0%, 100%': { backgroundPosition: '0% 50%', backgroundSize: '300% 300%' },
          '50%': { backgroundPosition: '100% 50%', backgroundSize: '300% 300%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(139,92,246,0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(6,182,212,0.5)' },
        },
      },
      backgroundSize: {
        '300%': '300%',
        '400%': '400%',
      },
      boxShadow: {
        'aurora': '0 4px 24px rgba(139,92,246,0.25)',
        'aurora-lg': '0 8px 40px rgba(139,92,246,0.35)',
        'glow-purple': '0 0 20px rgba(139,92,246,0.5)',
        'glow-cyan': '0 0 20px rgba(6,182,212,0.5)',
        'inner-aurora': 'inset 0 1px 0 rgba(255,255,255,0.1)',
      },
    },
  },
  plugins: [],
}
