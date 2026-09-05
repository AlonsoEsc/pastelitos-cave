import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pastelito’s cave 😗🤭',
  description: 'Un rincón hecho con amor para Mariela Alejandra Cruz Aguirre.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
