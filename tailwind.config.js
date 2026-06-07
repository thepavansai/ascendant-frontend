/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0B0F1A',
        surface: '#111827',
        surface2: '#1A2235',
        border: '#1F2D45',
        purple: '#8B5CF6',
        purpleLight: '#A78BFA',
        teal: '#06B6D4',
        green: '#10B981',
        amber: '#F59E0B',
        red: '#EF4444',
        orange: '#F97316',
        white: '#F8FAFC',
        offwhite: '#CBD5E1',
        muted: '#64748B',
        dimmed: '#475569',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        card: '16px',
        button: '8px',
        pill: '20px',
      },
    },
  },
  plugins: [],
};
