/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#16233B',       // primary navy (headings, key actions)
        ink2: '#28405F',      // secondary navy (hover/active)
        paper: '#F7F7F5',     // page background, warm off-white
        card: '#FFFFFF',
        line: '#E4E1D8',      // hairline borders, warm gray
        muted: '#6B7280',     // secondary text
        gold: '#B8894B',      // formal accent, "found" / highlights
        lost: '#9B4A3F',      // muted brick red, "lost" tag
        found: '#3E6B52',     // muted green, "found" tag
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'serif'],
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        xl: '14px',
        '2xl': '20px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(22, 35, 59, 0.06), 0 4px 16px rgba(22, 35, 59, 0.04)',
      },
      maxWidth: {
        app: '430px',
      },
    },
  },
  plugins: [],
};
