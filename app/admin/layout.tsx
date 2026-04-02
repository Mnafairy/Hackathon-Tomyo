import { redirect } from 'next/navigation';
import Link from 'next/link';

import {
  LayoutDashboard,
  Briefcase,
  Radio,
  ArrowLeft,
  Shield,
} from 'lucide-react';

import { requireAdmin } from '@/lib/auth-utils';

const navLinks = [
  { href: '/admin', label: 'Хянах самбар', icon: LayoutDashboard },
  { href: '/admin/opportunities', label: 'Боломжууд', icon: Briefcase },
  { href: '/admin/scraper', label: 'Скрэйпэр', icon: Radio },
];

const AdminLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  try {
    await requireAdmin();
  } catch {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="sticky top-0 flex h-screen w-72 flex-col border-r border-outline-variant/20 bg-surface-container-low">
        {/* Logo area */}
        <div className="flex items-center gap-3 border-b border-outline-variant/20 px-6 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-ds-primary to-ds-tertiary">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="heading-section text-sm font-bold tracking-tight text-on-surface">
              Opportunity AI
            </p>
            <p className="text-[11px] font-medium uppercase tracking-widest text-on-surface-variant">
              Админ панел
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1 px-3 pt-4">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-on-surface-variant/60">
            Удирдлага
          </p>
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-on-surface-variant transition-all duration-200 hover:bg-ds-primary/10 hover:text-ds-primary"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container transition-colors group-hover:bg-ds-primary/15">
                  <Icon className="h-4 w-4" />
                </div>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom link */}
        <div className="border-t border-outline-variant/20 px-3 py-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-on-surface-variant transition-all duration-200 hover:bg-ds-primary/10 hover:text-ds-primary"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container">
              <ArrowLeft className="h-4 w-4" />
            </div>
            Нүүр хуудас
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
