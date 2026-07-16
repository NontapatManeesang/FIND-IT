import './globals.css';

export const metadata = {
  title: 'FindIt — Lost it? Find it.',
  description: 'ระบบแจ้งของหายและของที่พบภายในมหาวิทยาลัย',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
