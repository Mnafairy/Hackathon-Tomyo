'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

import { MobileNav } from '@/components/layout/MobileNav';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/', label: 'Нүүр' },
  { href: '/discovery', label: 'Боломжууд' },
  { href: '/community', label: 'Нийгэмлэг' },
  { href: '/profile', label: 'Профайл' },
];

export const Navbar = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isLight, setIsLight] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      setIsLight(true);
    }
  }, []);

  const toggleTheme = () => {
    const next = !isLight;
    setIsLight(next);
    if (next) {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  const userInitial = session?.user?.name?.charAt(0)
    ?? session?.user?.email?.charAt(0)?.toUpperCase()
    ?? '?';

  return (
    <nav className="sticky top-0 z-50 border-b border-outline-variant/20 bg-background/60 backdrop-blur-2xl backdrop-saturate-150">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-ds-primary to-ds-tertiary transition-transform duration-300 group-hover:scale-110">
            <span className="text-sm font-black text-white">L</span>
          </div>
          <span className="heading-section text-lg font-bold tracking-tight text-on-background">
            Lumina
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const href = mounted && link.href === '/profile' && !session?.user ? '/login' : link.href;
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={href}
                className={cn(
                  'relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300',
                  isActive
                    ? 'text-ds-primary'
                    : 'text-on-surface-variant hover:text-on-surface'
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-ds-primary" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
            title={isLight ? 'Харанхуй горим' : 'Гэрэлтэй горим'}
          >
            {isLight ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>
          <MobileNav />
          {session?.user ? (
            <>
              <button className="btn-glow rounded-full bg-gradient-to-r from-ds-primary to-ds-secondary px-5 py-2 text-sm font-semibold text-on-primary-fixed shadow-lg shadow-ds-primary/20">
                Төсөл нэмэх
              </button>
              <Link
                href="/profile"
                className="relative h-9 w-9 overflow-hidden rounded-full bg-gradient-to-br from-ds-primary/20 to-ds-tertiary/20 p-[2px] transition-transform hover:scale-105"
              >
                <div className="flex h-full w-full items-center justify-center rounded-full bg-surface-container text-xs font-bold text-ds-primary">
                  {userInitial}
                </div>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-xs text-on-surface-variant hover:text-ds-error transition-colors"
                title="Гарах"
              >
                Гарах
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="btn-glow rounded-full bg-gradient-to-r from-ds-primary to-ds-secondary px-5 py-2 text-sm font-semibold text-on-primary-fixed shadow-lg shadow-ds-primary/20"
            >
              Нэвтрэх
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
