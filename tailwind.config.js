/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        obsidian: { DEFAULT: '#080808', 50:'#1a1a1a', 100:'#141414', 200:'#101010', 300:'#0c0c0c', 400:'#080808' },
        gold: {
          50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d',
          400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309',
          800: '#92400e', 900: '#78350f', champagne: '#F7E7CE', royal: '#FFD700',
        },
        titanium: { DEFAULT: '#8E8E93', light: '#AEAEB2', dark: '#636366', darker: '#3A3A3C' },
        compare: '#FF453A',
        swap: '#FF9F0A',
        sorted: '#30D158',
        pivot: '#BF5AF2',
        merge: '#0A84FF',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F7E7CE 0%, #FFD700 50%, #B8860B 100%)',
        'obsidian-gradient': 'linear-gradient(180deg, #0a0a0a 0%, #080808 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,215,0,0.05) 0%, rgba(255,215,0,0.02) 100%)',
      },
      boxShadow: {
        'gold-sm': '0 0 10px rgba(255,215,0,0.15)',
        'gold-md': '0 0 20px rgba(255,215,0,0.2)',
        'gold-lg': '0 0 40px rgba(255,215,0,0.25)',
        'gold-xl': '0 0 60px rgba(255,215,0,0.3)',
        'glass': 'inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 20px rgba(0,0,0,0.6)',
        'panel': '0 8px 32px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,215,0,0.08)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'fade-in': 'fade-in 0.4s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 20s linear infinite',
        'orbit': 'orbit 15s linear infinite',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-12px)' } },
        'pulse-gold': { '0%,100%': { boxShadow: '0 0 5px rgba(255,215,0,0.2)' }, '50%': { boxShadow: '0 0 20px rgba(255,215,0,0.5)' } },
        'slide-up': { '0%': { opacity: 0, transform: 'translateY(20px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        'fade-in': { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        'shimmer': { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        orbit: { from: { transform: 'rotate(0deg) translateX(120px) rotate(0deg)' }, to: { transform: 'rotate(360deg) translateX(120px) rotate(-360deg)' } },
      },
    },
  },
  plugins: [],
}
