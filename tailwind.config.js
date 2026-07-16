/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink:   '#0f172a',
        ink2:  '#475569',
        paper: '#f8fafc',
        card:  '#ffffff',
        line:  '#e2e8f0',
        muted: '#94a3b8',
        primary: {
          DEFAULT: '#6366f1',
          light:   '#818cf8',
          subtle:  '#eef2ff',
        },
        lost: {
          DEFAULT: '#f43f5e',
          light:   '#fb7185',
          subtle:  '#fff1f2',
        },
        found: {
          DEFAULT: '#10b981',
          light:   '#34d399',
          subtle:  '#ecfdf5',
        },
        accent: '#f59e0b',
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        sans:    ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        soft:  '0 2px 12px -2px rgba(0,0,0,0.06)',
        md:    '0 8px 24px -4px rgba(0,0,0,0.08)',
        float: '0 12px 32px -4px rgba(99,102,241,0.18)',
      },
      screens: {
        xs: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
  },
  plugins: [],
};
