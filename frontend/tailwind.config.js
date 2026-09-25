/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Fira Sans"', 'sans-serif'],
        display: ['"Fira Sans"', 'sans-serif'],
        mono: ['"Fira Code"', 'monospace'],
      },
      colors: {
        dark: {
          950: '#050814',
          900: '#090f20',
          850: '#10182b',
          800: '#16213a',
          700: '#273554',
          600: '#445476',
        },
        brand: {
          emerald: '#b8f35a',
          cyan: '#61a5ff',
          violet: '#9d8cff',
          amber: '#f5c66c',
          rose: '#f43f5e',
        }
      },
      boxShadow: {
        'glow-emerald': '0 14px 36px -18px rgba(184, 243, 90, 0.48)',
        'glow-cyan': '0 14px 36px -18px rgba(97, 165, 255, 0.42)',
        'glow-violet': '0 0 25px -5px rgba(139, 92, 246, 0.3)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.3)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleUp: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        }
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fadeIn': 'fadeIn 0.2s ease-out forwards',
        'scaleUp': 'scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }
    },
  },
  plugins: [],
}
