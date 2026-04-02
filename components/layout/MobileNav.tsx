'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/', label: 'Нүүр', icon: 'home', desc: 'Эхлэл хуудас' },
  { href: '/discovery', label: 'Боломжууд', icon: 'compass', desc: 'Төсөл, тэмцээн хайх' },
  { href: '/community', label: 'Нийгэмлэг', icon: 'users', desc: 'Хамтын ажиллагаа' },
  { href: '/profile', label: 'Профайл', icon: 'user', desc: 'Миний хуудас' },
  { href: '/saved', label: 'Хадгалсан', icon: 'bookmark', desc: 'Хадгалсан боломжууд' },
];

const NavIcon = ({ icon }: { icon: string }) => {
  const cls = 'h-5 w-5';
  switch (icon) {
    case 'home':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      );
    case 'compass':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
        </svg>
      );
    case 'users':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      );
    case 'user':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      );
    case 'bookmark':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
        </svg>
      );
    default:
      return null;
  }
};

export const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const close = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 250);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, close]);

  const userInitial = session?.user?.name?.charAt(0)
    ?? session?.user?.email?.charAt(0)?.toUpperCase()
    ?? '?';

  return (
    <div className="md:hidden">
      {/* Animated hamburger button */}
      <button
        onClick={() => (open ? close() : setOpen(true))}
        className={cn(
          'hamburger-line-group relative flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-xl transition-colors',
          'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface',
          open && 'hamburger-open',
        )}
        aria-label={open ? 'Цэс хаах' : 'Цэс нээх'}
        aria-expanded={open}
      >
        <span className="hamburger-line block h-[2px] w-5 rounded-full bg-current" />
        <span className="hamburger-line block h-[2px] w-5 rounded-full bg-current" />
        <span className="hamburger-line block h-[2px] w-5 rounded-full bg-current" />
      </button>

      {/* Full-screen overlay — portal to escape navbar stacking context */}
      {open && createPortal(
        <div
          className={cn(
            'fixed inset-0 z-[100] overflow-y-auto bg-background',
            closing ? 'animate-menu-overlay-out' : 'animate-menu-overlay-in',
          )}
        >
          {/* Decorative orbs */}
          <div className="animate-menu-orb pointer-events-none absolute -right-20 top-32 h-64 w-64 rounded-full bg-ds-primary/10 blur-[100px]" />
          <div className="animate-menu-orb pointer-events-none absolute -left-16 bottom-40 h-48 w-48 rounded-full bg-ds-tertiary/10 blur-[80px]" style={{ animationDelay: '-3s' }} />

          {/* Content */}
          <div className="relative flex min-h-full flex-col px-6 pt-20 pb-8">
            {/* Close button */}
            <button
              onClick={close}
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container/60 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
              aria-label="Хаах"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div
              className="animate-menu-slide-up mb-8"
              style={{ animationDelay: '50ms' }}
            >
              <p className="heading-section text-sm font-semibold uppercase tracking-widest text-ds-primary">
                Peony
              </p>
              <p className="mt-1 text-sm text-on-surface-variant">
                Боломжоо олоорой
              </p>
            </div>

            {/* Accent line */}
            <div
              className="animate-menu-slide-up mb-6 h-px w-full bg-gradient-to-r from-ds-primary/40 via-ds-tertiary/20 to-transparent"
              style={{ animationDelay: '100ms' }}
            />

            {/* Nav links */}
            <nav className="flex flex-1 flex-col gap-1.5">
              {NAV_LINKS.map((link, i) => {
                const isActive =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={close}
                    className={cn(
                      'animate-menu-slide-up group flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-all duration-300',
                      isActive
                        ? 'bg-ds-primary/10 shadow-[inset_0_0_0_1px_rgba(255,122,197,0.15)]'
                        : 'hover:bg-surface-container-high/60',
                    )}
                    style={{ animationDelay: `${150 + i * 60}ms` }}
                  >
                    {/* Icon container */}
                    <div
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300',
                        isActive
                          ? 'bg-gradient-to-br from-ds-primary to-ds-secondary text-white shadow-lg shadow-ds-primary/20'
                          : 'bg-surface-container text-on-surface-variant group-hover:bg-surface-container-high group-hover:text-on-surface',
                      )}
                    >
                      <NavIcon icon={link.icon} />
                    </div>

                    {/* Label + description */}
                    <div className="flex flex-col">
                      <span
                        className={cn(
                          'heading-section text-base font-semibold tracking-tight transition-colors',
                          isActive ? 'text-ds-primary' : 'text-on-surface group-hover:text-on-surface',
                        )}
                      >
                        {link.label}
                      </span>
                      <span className="text-xs text-on-surface-variant/70">
                        {link.desc}
                      </span>
                    </div>

                    {/* Active indicator */}
                    {isActive && (
                      <div className="ml-auto h-2 w-2 rounded-full bg-ds-primary shadow-[0_0_8px_rgba(255,122,197,0.6)]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom section */}
            <div
              className="animate-menu-slide-up mt-auto pt-4"
              style={{ animationDelay: `${150 + NAV_LINKS.length * 60 + 60}ms` }}
            >
              <div className="mb-4 h-px w-full bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />

              {session?.user ? (
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-ds-primary to-ds-tertiary text-sm font-bold text-white">
                    {userInitial}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-semibold text-on-surface">
                      {session.user.name ?? session.user.email?.split('@')[0]}
                    </span>
                    <span className="truncate text-xs text-on-surface-variant">
                      {session.user.email}
                    </span>
                  </div>
                  <button
                    onClick={() => { signOut(); close(); }}
                    className="rounded-xl bg-surface-container px-3.5 py-2 text-xs font-medium text-on-surface-variant transition-colors hover:bg-ds-error/10 hover:text-ds-error"
                  >
                    Гарах
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={close}
                  className="btn-glow flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-ds-primary to-ds-secondary py-3.5 text-sm font-bold text-white shadow-lg shadow-ds-primary/25"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                  </svg>
                  Нэвтрэх
                </Link>
              )}
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
};
