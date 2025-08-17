"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ReceiptText, History, Coins, LogOut, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/contexts/settings-context';

// Interface des routes
interface Route {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

const routes = [
  { label: "Tableau de Bord", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Caisse", icon: ReceiptText, href: "/caisse" },
  { label: "Historique", icon: History, href: "/historique" },
  { label: "Clôturer Caisse", icon: Coins, href: "/caisse/cloturer" },
];

export default function TopBar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openingBalance, setOpeningBalance] = useState<number | null>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const router = useRouter();
  const { resetSettings } = useSettings();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("opening_balance");
    setOpeningBalance(null);

   
    router.push("/"); 
    
    setTimeout(() => {
      resetSettings();
    }, 500);
  };

  const navLinks = useMemo(() => {
    return routes.map((route) => {
      const isActive = pathname === route.href;
      return (
        <Link
          key={route.href}
          href={route.href}
          onClick={() => setIsMobileMenuOpen(false)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            isActive
              ? 'font-semibold text-green-700'
              : 'text-gray-700 hover:bg-white/90'
          }`}
          aria-current={isActive ? 'page' : undefined}
        >
          <route.icon className="h-5 w-5" />
          <span>{route.label}</span>
        </Link>
      );
    });
  }, [pathname]);

  return (
    <>
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#f0fef4] shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          {/* Logo et Titre */}
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-8 w-8 text-green-700" />
            <span className="text-xl font-bold text-gray-900">
              Hôpital 
            </span>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center gap-2">{navLinks}</nav>

          {/* Actions utilisateur */}
          <div className="flex items-center gap-4">
            {/* Profil utilisateur */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <img
                  src="https://via.placeholder.com/32"
                  alt="Caissière profile"
                  className="w-8 h-8 rounded-full border-2 border-green-100"
                />
                <span className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-900">
                Caissière
              </span>
            </div>

            {/* Bouton Déconnexion */}
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              aria-label="Se déconnecter"
            >
              <LogOut className="h-4 w-4" />
              <span>Déconnexion</span>
            </button>

            {/* Bouton Mobile Menu */}
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false); 
              }}
              className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Overlay du menu mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Menu mobile */}
      <nav
        className={`fixed top-16 left-0 right-0 bg-[#f0fef4] shadow-lg z-40 lg:hidden transform transition-all duration-300 ${
          isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
        <div className="p-4 flex flex-col gap-2">
          {navLinks}
          <hr className="border-t border-gray-200 my-2" />
          <button
            onClick={() => {
              alert("Déconnexion en cours...");
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            aria-label="Se déconnecter"
          >
            <LogOut className="h-5 w-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </nav>
    </>
  );
}
