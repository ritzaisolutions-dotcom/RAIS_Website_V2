/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        border: 'hsl(var(--border))',
        'industrial-orange': 'hsl(var(--industrial-orange))',
        'industrial-orange-bright': 'hsl(var(--industrial-orange-bright))',
        sage: 'hsl(var(--sage))',
        pistachio: 'hsl(var(--dark-pistachio))',
        stone: 'hsl(var(--muted-stone))',
        surface: 'hsl(var(--surface))',
      },
      fontFamily: {
        display: ['Baskerville', 'Palatino Linotype', 'Book Antiqua', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
