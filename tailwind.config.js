/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html'],
  theme: {
    extend: {
      /* Die Tokens sind Hex, nicht HSL-Tripel. hsl(var(--x)) hat hier nie aufgeloest. */
      colors: {
        background: 'var(--background)',
        surface: 'var(--surface)',
        border: 'var(--border)',
        charcoal: 'var(--charcoal)',
        stone: 'var(--stone)',
        orange: 'var(--orange)',
        'orange-hover': 'var(--orange-hover)',
        sage: 'var(--sage)',
        'sage-light': 'var(--sage-light)',
        'racing-green': 'var(--racing-green)',
        'green-900': 'var(--green-900)',
        'green-800': 'var(--green-800)',
        'green-700': 'var(--green-700)',
        'linen-on-green': 'var(--linen-on-green)',
      },
      fontFamily: {
        display: ['Source Serif 4', 'Iowan Old Style', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        sans: ['Instrument Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
