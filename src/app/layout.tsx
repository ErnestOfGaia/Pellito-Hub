import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pellito Hub',
  description: 'Kitchen training for Pelican Brewery',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
