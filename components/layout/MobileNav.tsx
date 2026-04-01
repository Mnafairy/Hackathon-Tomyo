'use client';

import { useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/', label: 'Нүүр' },
  { href: '/discovery', label: 'Боломжууд' },
  { href: '/community', label: 'Нийгэмлэг' },
  { href: '/profile', label: 'Профайл' },
  { href: '/saved', label: 'Хадгалсан' },
];

export const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:text-on-surface"
        aria-label="Цэс"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {open && (
        <div className="animate-fade-in fixed inset-0 top-[65px] z-40 bg-background/95 backdrop-blur-xl">
          <nav className="flex flex-col gap-1 p-6">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'rounded-xl px-4 py-3 text-lg font-medium transition-colors',
                    isActive
                      ? 'bg-ds-primary/10 text-ds-primary'
                      : 'text-on-surface-variant hover:bg-surface-container-high'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="mt-6 border-t border-outline-variant/20 pt-6">
              {session?.user ? (
                <button
                  onClick={() => { signOut(); setOpen(false); }}
                  className="w-full rounded-xl bg-surface-container-high px-4 py-3 text-left text-sm font-medium text-on-surface-variant"
                >
                  Гарах ({session.user.email})
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="btn-glow block rounded-full bg-gradient-to-r from-ds-primary to-ds-secondary px-6 py-3 text-center text-sm font-semibold text-on-primary-fixed"
                >
                  Нэвтрэх
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
};
