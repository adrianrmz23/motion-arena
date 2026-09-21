import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Motion Arena',
  description: 'Juega con tu cuerpo. Entrena sin sentir que estás entrenando.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
