/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./layouts/**/*.html",
    "./content/**/*.md",
    "./assets/js/**/*.js",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#0ea5e9', // Updated to match HUD cyan for legacy compatibility
        background: {
          light: '#f6f8f8',
          dark: '#0b0f15', // Updated to match HUD bg
        },
        surface: {
          light: '#e2e8f0',
          dark: '#1e293b',
        },
        hud: {
          bg: '#0b0f15',
          cyan: '#0ea5e9',
          purple: '#8a2be2'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Inter-Fallback', 'sans-serif'],
        display: ['Geist', 'Geist-Fallback', 'sans-serif'],
        mono: ['JetBrains Mono', 'JetBrainsMono-Fallback', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
