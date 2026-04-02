'use client';

import { useEffect, useRef, useState } from 'react';

import Link from 'next/link';
import { signOut } from 'next-auth/react';

import { cn } from '@/lib/utils';

interface UserDropdownProps {
  userInitial: string;
  displayName: string;
  email: string;
}

export const UserDropdown = ({ userInitial, displayName, email }: UserDropdownProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setMenuOpen((p) => !p)}
        className={cn(
          'relative flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-200',
          menuOpen
            ? 'border-ds-primary shadow-[0_0_12px_rgba(255,122,197,0.3)]'
            : 'border-transparent hover:border-ds-primary/40',
        )}
      >
        <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-ds-primary/20 to-ds-tertiary/20 text-xs font-bold text-ds-primary">
          {userInitial}
        </div>
      </button>

      {menuOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 origin-top-right animate-scale-in overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container shadow-xl shadow-black/20">
          <div className="border-b border-outline-variant/15 px-4 py-3">
            <p className="truncate text-sm font-semibold text-on-surface">{displayName}</p>
            <p className="truncate text-xs text-on-surface-variant/60">{email}</p>
          </div>

          <div className="py-1.5">
            <Link href="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-on-surface-variant transition-colors hover:bg-ds-primary/10 hover:text-ds-primary">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
              Профайл
            </Link>
            <Link href="/saved" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-on-surface-variant transition-colors hover:bg-ds-primary/10 hover:text-ds-primary">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></svg>
              Хадгалсан
            </Link>
            <Link href="/post-project" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-on-surface-variant transition-colors hover:bg-ds-primary/10 hover:text-ds-primary md:hidden">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              Төсөл нэмэх
            </Link>
          </div>

          <div className="border-t border-outline-variant/15 py-1.5">
            <button
              onClick={() => { setMenuOpen(false); signOut({ callbackUrl: '/' }); }}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-ds-error/80 transition-colors hover:bg-ds-error/10 hover:text-ds-error"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
              Гарах
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
