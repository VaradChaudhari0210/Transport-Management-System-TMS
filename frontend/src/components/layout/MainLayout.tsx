import { ReactNode } from 'react';
import { Header } from './Header';

interface MainLayoutProps {
  children: ReactNode;
  onAddShipment?: () => void;
}

export function MainLayout({ children, onAddShipment }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header onAddShipment={onAddShipment} />
      <main className="container py-3 sm:py-6 px-2 sm:px-6">
        {children}
      </main>
    </div>
  );
}
