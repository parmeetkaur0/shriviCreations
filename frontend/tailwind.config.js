/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sage: {
          DEFAULT: '#8F9D88',
          light: '#BAC2B1',
          dark: '#6E7C67',
          50: '#F3F5F0',
        },
        cream: {
          DEFAULT: '#F7F2EC',
          dark: '#ECE2D5',
        },
        ink: '#2F2621',
        gold: {
          DEFAULT: '#C18A64',
          light: '#D8AF8D',
          dark: '#A16945',
        },
        blush: '#E9D6CC',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(62, 58, 54, 0.15)',
        card: '0 4px 24px -4px rgba(62, 58, 54, 0.10)',
        glass: '0 8px 32px 0 rgba(62, 58, 54, 0.12)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(24px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        drawLine: {
          '0%': { strokeDashoffset: 400 },
          '100%': { strokeDashoffset: 0 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.8s ease forwards',
        drawLine: 'drawLine 2s ease forwards',
        shimmer: 'shimmer 1.6s infinite linear',
      },
    },
  },
  plugins: [],
};
