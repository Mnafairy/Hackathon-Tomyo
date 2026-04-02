import Link from 'next/link';

interface ProfileSidebarProps {
  userName: string | null | undefined;
  email: string;
  joinDate: string;
}

export const ProfileSidebar = ({ userName, email, joinDate }: ProfileSidebarProps) => {
  return (
    <div className="space-y-6 lg:col-span-2">
      {/* Account Info Card */}
      <div className="animate-fade-up delay-2 glass-panel glow-border rounded-2xl p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-on-surface-variant/60">
          Бүртгэлийн мэдээлэл
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40">
              Нэр
            </p>
            <p className="mt-0.5 text-sm font-medium text-on-surface">
              {userName ?? '—'}
            </p>
          </div>
          <div className="h-px bg-outline-variant/20" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40">
              Имэйл
            </p>
            <p className="mt-0.5 text-sm font-medium text-on-surface">
              {email}
            </p>
          </div>
          <div className="h-px bg-outline-variant/20" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40">
              Бүртгүүлсэн
            </p>
            <p className="mt-0.5 text-sm font-medium text-on-surface">
              {joinDate}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="animate-fade-up delay-3 rounded-2xl border border-ds-primary/10 bg-gradient-to-br from-ds-primary/5 to-ds-tertiary/5 p-6">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-on-surface-variant/60">
          Шуурхай холбоос
        </h3>
        <div className="space-y-2">
          <Link
            href="/discovery"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-on-surface transition-colors hover:bg-ds-primary/10 hover:text-ds-primary"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Боломж хайх
          </Link>
          <Link
            href="/community"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-on-surface transition-colors hover:bg-ds-primary/10 hover:text-ds-primary"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Нийгэмлэг
          </Link>
        </div>
      </div>
    </div>
  );
};
