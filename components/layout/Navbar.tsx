'use client';

import { useRef, useSyncExternalStore } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { MobileNav } from '@/components/layout/MobileNav';
import { UserDropdown } from '@/components/layout/UserDropdown';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/', label: 'Нүүр' },
  { href: '/discovery', label: 'Боломжууд' },
  { href: '/community', label: 'Нийгэмлэг' },
];

export const Navbar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const mounted = useHasMounted();
  const isLight = useTheme();

  const userInitial = session?.user?.name?.charAt(0)
    ?? session?.user?.email?.charAt(0)?.toUpperCase()
    ?? '?';

  const displayName = session?.user?.name
    ?? session?.user?.email?.split('@')[0]
    ?? 'Хэрэглэгч';

  return (
    <nav className="sticky top-0 z-50 border-b border-outline-variant/20 bg-background/60 backdrop-blur-2xl backdrop-saturate-150">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" className="group flex items-center gap-2.5">
          <Image
            src="/logo.svg"
            alt="Peony лого"
            width={64}
            height={64}
            className="transition-transform duration-300 group-hover:scale-110"
          />
          <span className="heading-section text-lg font-bold tracking-tight text-on-background">
            Peony
          </span>
        </Link>

        <div className="hidden items-center gap-0.5 rounded-full bg-surface-container/60 px-1.5 py-1 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300',
                  isActive
                    ? 'bg-ds-primary/15 text-ds-primary'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60',
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const next = !isLight;
              document.documentElement.classList.toggle('light', next);
              document.documentElement.classList.toggle('dark', !next);
              localStorage.setItem('theme', next ? 'light' : 'dark');
              window.dispatchEvent(new StorageEvent('storage', { key: 'theme' }));
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
            title={isLight ? 'Харанхуй горим' : 'Гэрэлтэй горим'}
          >
            {isLight ? (
              <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>
          <MobileNav />
          {mounted && session?.user ? (
            <>
              <Link
                href="/post-project"
                className="btn-glow hidden rounded-full bg-gradient-to-r from-ds-primary to-ds-secondary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-ds-primary/20 md:inline-flex"
              >
                + Төсөл нэмэх
              </Link>
              <div className="hidden md:block">
                <UserDropdown
                  userInitial={userInitial}
                  displayName={displayName}
                  email={session.user.email ?? ''}
                />
              </div>
            </>
          ) : mounted ? (
            <Link
              href="/login"
              className="btn-glow hidden rounded-full bg-gradient-to-r from-ds-primary to-ds-secondary px-5 py-2 text-sm font-semibold text-on-primary-fixed shadow-lg shadow-ds-primary/20 md:inline-flex"
            >
              Нэвтрэх
            </Link>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

const subscribe = (_cb: () => void) => () => {};
const useHasMounted = () => useSyncExternalStore(subscribe, () => true, () => false);

const useTheme = () => {
  const themeRef = useRef(false);

  return useSyncExternalStore(
    (cb) => {
      window.addEventListener('storage', cb);
      return () => window.removeEventListener('storage', cb);
    },
    () => {
      const val = localStorage.getItem('theme') === 'light';
      themeRef.current = val;
      return val;
    },
    () => false,
  );
};
