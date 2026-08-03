/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#0ea5e9',
        background: {
          light: '#f6f8f8',
          dark: '#0b0f15',
        },
        surface: {
          light: '#e2e8f0',
          dark: '#1e293b',
        },
        hud: {
          bg: '#0b0f15',
          cyan: '#0ea5e9',
          purple: '#8a2be2',
        },
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
};
