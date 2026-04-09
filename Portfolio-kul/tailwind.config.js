/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-bg': '#1a1a2e',
        'secondary-bg': '#16213e',
        'accent-1': '#00f5c3',
        'accent-2': '#e94560',
        'text-primary': '#e0e0e0',
        'text-secondary': '#a0a0a0',
      },
      fontFamily: {
        sans: ['"JetBrains Mono"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      animation: {
        'text-focus-in': 'text-focus-in 1s cubic-bezier(0.55, 0.085, 0.68, 0.53) both',
        'slide-in-bottom': 'slide-in-bottom 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
      },
      keyframes: {
        'text-focus-in': {
          '0%': { filter: 'blur(12px)', opacity: '0' },
          '100%': { filter: 'blur(0px)', opacity: '1' },
        },
        'slide-in-bottom': {
          '0%': { transform: 'translateY(50px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}