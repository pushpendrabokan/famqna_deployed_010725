/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        deep: {
          100: '#1E1B2D',
          200: '#16141F',
          300: '#0F0D17',
          400: '#0A0814',
        },
        primary: {
          DEFAULT: '#9333EA',
          hover: '#7E22CE',
          light: '#A855F7',
          dark: '#6B21A8',
        },
        accent: {
          purple: '#A855F7',
          blue: '#60A5FA',
          pink: '#EC4899',
          green: '#10B981',
        },
        light: {
          100: '#F8FAFC',
          200: '#E2E8F0', 
          300: '#94A3B8',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'SF Pro Display',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Arial',
          'sans-serif',
        ],
        display: ['Poppins', 'SF Pro Display', 'system-ui']
      },
      boxShadow: {
        glow: '0 0 15px rgba(147, 51, 234, 0.4)',
        'glow-purple': '0 0 15px rgba(168, 85, 247, 0.4)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '100% 0' },
          '100%': { backgroundPosition: '0 0' },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        buttonPulse: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' },
        }
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 5s ease-in-out infinite',
        gradient: 'gradient 5s ease infinite',
        fadeIn: 'fadeIn 0.5s ease-out',
        buttonPulse: 'buttonPulse 2s ease-in-out infinite',
      },
      backgroundSize: {
        'size-200': '200% 200%',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};