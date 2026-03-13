/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        border: 'hsl(var(--border))',
        'terminal-green': 'hsl(var(--terminal-green))',
        'terminal-green-bright': 'hsl(var(--terminal-green-bright))',
        'industrial-orange': 'hsl(var(--industrial-orange))',
        'industrial-orange-bright': 'hsl(var(--industrial-orange-bright))',
        'status-cyan': 'hsl(var(--status-cyan))',
        'status-cyan-bright': 'hsl(var(--status-cyan-bright))',
        'accent-purple': 'hsl(var(--accent-purple))',
        'accent-purple-bright': 'hsl(var(--accent-purple-bright))',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
