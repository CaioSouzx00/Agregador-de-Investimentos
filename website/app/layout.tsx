import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Agregador de Investimentos | Sua carteira em perspectiva',
  description: 'API Spring Boot e app Expo para reunir contas, posições e valuation de investimentos.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
