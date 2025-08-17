// app/layout.jsx

import './globals.css';
import { Inter } from 'next/font/google';
import { SettingsProvider } from '../contexts/settings-context';


const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Gestion Caisse Hospitalière',
  description: 'Application de gestion financière pour hôpitaux',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
         className={inter.className}
      >
        <SettingsProvider>
            {children}
        </SettingsProvider>
          
      </body>
    </html>
  );
}
