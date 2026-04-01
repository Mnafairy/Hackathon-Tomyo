import { redirect } from 'next/navigation';
import Link from 'next/link';

import { requireAdmin } from '@/lib/auth-utils';

const navLinks = [
  { href: '/admin', label: 'Хянах самбар' },
  { href: '/admin/opportunities', label: 'Боломжууд' },
  { href: '/admin/scraper', label: 'Скрэйпэр' },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireAdmin();
  } catch {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="glass-panel sticky top-0 flex h-screen w-64 flex-col gap-2 p-6">
        <h1 className="heading-section mb-8 text-2xl font-bold text-ds-primary">
          Админ
        </h1>
        <nav className="flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-on-surface-variant transition-colors hover:bg-ds-primary/10 hover:text-ds-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto">
          <Link
            href="/"
            className="text-sm text-on-surface-variant transition-colors hover:text-ds-primary"
          >
            Нүүр хуудас руу
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
