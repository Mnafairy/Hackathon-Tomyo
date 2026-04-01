'use client';

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
  const { data: session } = useSession();

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
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
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
          <MobileNav />
          {session?.user ? (
            <>
              <button className="btn-glow rounded-full bg-gradient-to-r from-ds-primary to-ds-secondary px-5 py-2 text-sm font-semibold text-on-primary-fixed shadow-lg shadow-ds-primary/20">
                Төсөл нэмэх
              </button>
              <button
                onClick={() => signOut()}
                className="relative h-9 w-9 overflow-hidden rounded-full bg-gradient-to-br from-ds-primary/20 to-ds-tertiary/20 p-[2px] transition-transform hover:scale-105"
                title="Гарах"
              >
                <div className="flex h-full w-full items-center justify-center rounded-full bg-surface-container text-xs font-bold text-ds-primary">
                  {userInitial}
                </div>
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
