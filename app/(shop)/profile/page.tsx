'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

interface SavedOpportunity {
  id: string;
  title: string;
  type: string;
  sourceName: string;
  originalUrl: string;
}

const TYPE_LABELS: Record<string, string> = {
  COMPETITION: 'Тэмцээн',
  SCHOLARSHIP: 'Тэтгэлэг',
  GRANT: 'Грант',
  INTERNSHIP: 'Дадлага',
  JOB: 'Ажлын байр',
  OTHER: 'Бусад',
};

const INTEREST_OPTIONS = [
  'STEM', 'Математик', 'Физик', 'Программчлал',
  'Биологи', 'Англи хэл', 'Урлаг', 'Бизнес',
];

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [interests, setInterests] = useState<string[]>([]);
  const [recentOpportunities, setRecentOpportunities] = useState<SavedOpportunity[]>([]);
  const [loadingOpps, setLoadingOpps] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetch('/api/opportunities?take=4')
      .then((r) => r.json())
      .then((data) => {
        setRecentOpportunities(
          (data.opportunities ?? []).slice(0, 4).map((o: SavedOpportunity) => ({
            id: o.id,
            title: o.title,
            type: o.type,
            sourceName: o.sourceName,
            originalUrl: o.originalUrl,
          })),
        );
        setLoadingOpps(false);
      })
      .catch(() => setLoadingOpps(false));
  }, []);

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest],
    );
  };

  if (status === 'loading') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-ds-primary border-t-transparent" />
      </div>
    );
  }

  if (!session?.user) return null;

  const user = session.user;
  const initial = user.name?.charAt(0)?.toUpperCase()
    ?? user.email?.charAt(0)?.toUpperCase()
    ?? '?';
  const displayName = user.name ?? user.email?.split('@')[0] ?? 'Хэрэглэгч';
  const email = user.email ?? '';
  const joinDate = new Date().toLocaleDateString('mn-MN', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      {/* ── Profile Header ── */}
      <section className="animate-fade-up delay-0">
        <div className="relative overflow-hidden rounded-2xl">
          {/* Banner */}
          <div className="h-36 bg-gradient-to-r from-ds-primary/25 via-ds-tertiary/15 to-ds-secondary/25 md:h-44">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(125,147,255,0.12)_0%,transparent_60%)]" />
          </div>

          {/* Avatar + Info row */}
          <div className="relative -mt-14 px-6 pb-6 md:px-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-background bg-gradient-to-br from-ds-primary to-ds-tertiary text-3xl font-black text-white shadow-xl shadow-ds-primary/20">
                  {initial}
                </div>
                <div className="pb-1">
                  <h1 className="heading-display text-2xl font-bold tracking-tight md:text-3xl">
                    {displayName}
                  </h1>
                  <p className="mt-0.5 text-sm text-on-surface-variant">
                    {email}
                  </p>
                  <p className="mt-0.5 text-xs text-on-surface-variant/60">
                    {joinDate}-с хойш нэгдсэн
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Grid ── */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left — wider */}
        <div className="space-y-6 lg:col-span-3">
          {/* Interests */}
          <section className="animate-fade-up delay-1 glass-panel glow-border rounded-2xl p-6">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-on-surface-variant/60">
              Сонирхлын чиглэлүүд
            </h2>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleInterest(tag)}
                  className={cn(
                    'rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200',
                    interests.includes(tag)
                      ? 'bg-gradient-to-r from-ds-primary/25 to-ds-secondary/25 text-ds-primary ring-1 ring-ds-primary/30'
                      : 'bg-surface-container-highest/60 text-on-surface-variant hover:bg-surface-container-highest',
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
            {interests.length > 0 && (
              <p className="mt-4 text-xs text-on-surface-variant/50">
                {interests.length} чиглэл сонгосон
              </p>
            )}
          </section>

          {/* Recommended Opportunities */}
          <section className="animate-fade-up delay-2">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-on-surface-variant/60">
              Сүүлийн боломжууд
            </h2>
            {loadingOpps ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="glass-card animate-pulse rounded-xl p-4">
                    <div className="h-4 w-3/4 rounded bg-surface-container-highest" />
                    <div className="mt-2 h-3 w-1/3 rounded bg-surface-container-highest" />
                  </div>
                ))}
              </div>
            ) : recentOpportunities.length > 0 ? (
              <div className="space-y-3">
                {recentOpportunities.map((opp, i) => (
                  <a
                    key={opp.id}
                    href={opp.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'glass-card glow-border animate-fade-up group flex items-center justify-between rounded-xl p-4',
                      `delay-${i + 3}`,
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-on-surface group-hover:text-ds-primary transition-colors">
                        {opp.title}
                      </h3>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="rounded-md bg-ds-primary/15 px-2 py-0.5 text-[10px] font-bold text-ds-primary">
                          {TYPE_LABELS[opp.type] ?? opp.type}
                        </span>
                        <span className="text-xs text-on-surface-variant/50">
                          {opp.sourceName}
                        </span>
                      </div>
                    </div>
                    <svg
                      className="ml-3 h-4 w-4 shrink-0 text-on-surface-variant/30 group-hover:text-ds-primary transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                ))}
              </div>
            ) : (
              <div className="glass-panel rounded-xl p-6 text-center">
                <p className="text-sm text-on-surface-variant">
                  Боломж олдсонгүй. Боломжууд хуудаснаас хайна уу.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Right sidebar */}
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
                  {user.name ?? '—'}
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
              <a
                href="/discovery"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-on-surface transition-colors hover:bg-ds-primary/10 hover:text-ds-primary"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Боломж хайх
              </a>
              <a
                href="/community"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-on-surface transition-colors hover:bg-ds-primary/10 hover:text-ds-primary"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Нийгэмлэг
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
