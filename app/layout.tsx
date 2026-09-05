import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mercy — Un mundo rosadito',
  description: 'Un rincón hecho con amor para Mariela Alejandra Cruz Aguirre.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
