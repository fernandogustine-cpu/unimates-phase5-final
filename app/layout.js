import './globals.css';

export const metadata = {
  title: 'Uni-Mates Chess Academy',
  description: 'Online chess academy portal for Coach Fernando and Uni-Mates Chess Academy.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
