'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, isAdmin, customer, logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/vehicles', label: 'EV Models' },
    { href: '/seminars', label: 'Seminars' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const linkClass = (href: string) =>
    isActive(href)
      ? 'font-headline tracking-tight text-primary font-bold border-b-2 border-primary pb-0.5'
      : 'font-headline tracking-tight text-on-surface-variant hover:text-on-surface transition-colors';

  const mobileLinkClass = (href: string) =>
    isActive(href)
      ? 'block px-4 py-3 font-headline font-bold text-primary bg-primary/5 rounded-lg'
      : 'block px-4 py-3 font-headline font-bold text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors';

  return (
    <nav className="fixed top-0 w-full z-50 glass-nav shadow-sm">
      <div className="flex justify-between items-center px-8 h-20 w-full max-w-screen-2xl mx-auto">

        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-tighter text-on-surface font-headline">
          KINETIC
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.label}
            </Link>
          ))}
          {isAuthenticated && !isAdmin && (
            <Link href="/my-registrations" className={linkClass('/my-registrations')}>
              My Registrations
            </Link>
          )}
          {isAdmin && (
            <Link href="/admin" className={linkClass('/admin')}>
              Admin Dashboard
            </Link>
          )}
        </div>

        {/* Desktop auth buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={toggle}
            className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
            aria-label="Toggle theme"
          >
            <span className="material-symbols-outlined text-xl">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                className="hidden lg:flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-base">account_circle</span>
                {customer?.name}
              </Link>
              <button
                onClick={logout}
                className="bg-surface-container-highest text-on-surface px-6 py-2 rounded-lg font-bold tracking-tight hover:opacity-80 transition-opacity"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-on-surface-variant hover:text-on-surface font-bold tracking-tight transition-colors">
                Login
              </Link>
              <Link href="/register" className="bg-primary text-on-primary px-6 py-2 rounded-lg font-bold tracking-tight hover:opacity-80 transition-opacity">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile theme toggle */}
        <button
          onClick={toggle}
          className="md:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors"
          aria-label="Toggle theme"
        >
          <span className="material-symbols-outlined text-xl">
            {isDark ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined">
            {mobileOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-surface-container-lowest border-t border-outline-variant/20 px-4 py-4 space-y-1 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={mobileLinkClass(link.href)}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && !isAdmin && (
            <>
              <Link href="/my-registrations" className={mobileLinkClass('/my-registrations')} onClick={() => setMobileOpen(false)}>
                My Registrations
              </Link>
              <Link href="/profile" className={mobileLinkClass('/profile')} onClick={() => setMobileOpen(false)}>
                Profile
              </Link>
            </>
          )}
          {isAdmin && (
            <Link href="/admin" className={mobileLinkClass('/admin')} onClick={() => setMobileOpen(false)}>
              Admin Dashboard
            </Link>
          )}
          <div className="pt-3 border-t border-outline-variant/20">
            {isAuthenticated ? (
              <button
                onClick={() => { logout(); setMobileOpen(false); }}
                className="w-full text-left px-4 py-3 font-headline font-bold text-error hover:bg-error/5 rounded-lg transition-colors"
              >
                Logout
              </button>
            ) : (
              <div className="flex gap-3">
                <Link href="/login" className="flex-1 text-center px-4 py-3 font-headline font-bold text-stone-600 border border-outline-variant rounded-lg" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
                <Link href="/register" className="flex-1 text-center px-4 py-3 font-headline font-bold bg-primary text-on-primary rounded-lg" onClick={() => setMobileOpen(false)}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
