/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink:   '#1e293b', // slate-800
        ink2:  '#475569', // slate-600
        paper: '#f8fafc', // slate-50
        card:  '#ffffff',
        line:  '#e2e8f0', // slate-200
        muted: '#94a3b8', // slate-400
        primary: {
          DEFAULT: '#f59e0b', // amber-500
          light:   '#fbbf24', // amber-400
          subtle:  '#fffbeb', // amber-50
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
        accent: '#64748b', // slate-500
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
