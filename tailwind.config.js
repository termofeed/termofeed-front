/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        termo: {
          cream: 'var(--termo-cream, #FFF6EA)',
          navy: 'var(--termo-navy, #1B2340)',
          coral: 'var(--termo-coral, #E8442F)',
          'coral-dark': 'var(--termo-coral-dark, #D63A26)',
          yellow: 'var(--termo-yellow, #FFB627)',
          surface: 'var(--termo-surface, #FFFFFF)',
        },
      },
      fontFamily: {
        display: ['Fredoka', 'sans-serif'],
        body: ['Space Grotesk', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(27, 35, 64, 0.08)',
        glow: '0 0 25px -5px rgba(232, 68, 47, 0.25)',
      },
    },
  },
  plugins: [],
};
