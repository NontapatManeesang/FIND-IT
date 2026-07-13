import './globals.css';

export const metadata = {
  title: 'FindIt — Lost it? Find it.',
  description: 'ระบบแจ้งของหายและของที่พบภายในมหาวิทยาลัย',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
