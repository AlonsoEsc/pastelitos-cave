import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pastelito’s cave 😗🤭',
  description: 'Un rincón hecho con amor para Mariela Alejandra Cruz Aguirre.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
