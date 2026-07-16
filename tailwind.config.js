/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#111827',
        ink2: '#374151',
        paper: '#F9FAFB',
        card: '#FFFFFF',
        line: '#E5E7EB',
        muted: '#6B7280',
        primary: '#2563EB',
        lost: '#F43F5E',
        found: '#10B981',
      },
      fontFamily: {
        display: ['Inter', 'Georgia', 'Cambria', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        xl: '14px',
        '2xl': '20px',
        '3xl': '28px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(22, 35, 59, 0.05), 0 4px 16px rgba(22, 35, 59, 0.04)',
        md: '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.04)',
      },
      maxWidth: {
        app: '480px',
        sidebar: '260px',
      },
      screens: {
        xs: '375px',
      },
    },
  },
  plugins: [],
};
