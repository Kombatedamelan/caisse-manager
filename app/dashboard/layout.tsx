// app/layout.tsx

import React from 'react';
import TopBar from '@/components/TopBar';
import { SettingsProvider } from '../../contexts/settings-context';

export const metadata = {
  title: 'Hôpital XYZ - Gestion de Caisse',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SettingsProvider>
      <section >
          <TopBar />
          <main className="pt-20 pb-20">
            
                {children}
            
          </main>
        
      </section>
    </SettingsProvider>
  );
}
