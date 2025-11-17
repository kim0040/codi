import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#359EFF',
        secondary: '#4D4D4D',
        accent: '#FFC107',
        'background-light': '#f5f7f8',
        'background-dark': '#0f1923'
      },
      fontFamily: {
        display: ['var(--font-inter)', 'var(--font-noto)', ...fontFamily.sans]
      },
      borderRadius: {
        lg: '0.75rem',
        xl: '1.25rem'
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at 1px 1px, rgba(53, 158, 255, 0.15) 1px, transparent 0)'
      }
    }
  },
  plugins: []
};

export default config;
