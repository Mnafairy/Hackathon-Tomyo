'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

import { ProfileHeader } from '@/features/profile/ProfileHeader';
import { InterestsSection } from '@/features/profile/InterestsSection';
import { ProfileSidebar } from '@/features/profile/ProfileSidebar';

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

const ProfilePage = () => {
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
    <div className="mx-auto max-w-7xl px-6 py-10">
      <ProfileHeader initial={initial} displayName={displayName} email={email} joinDate={joinDate} />

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <InterestsSection interests={interests} toggleInterest={toggleInterest} />

          <section className="animate-fade-up delay-2">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-on-surface-variant/60">Сүүлийн боломжууд</h2>
            {loadingOpps ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="glass-card animate-pulse rounded-xl p-4">
                    <div className="h-4 w-3/4 rounded bg-surface-container-highest" />
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
                    <svg className="ml-3 h-4 w-4 shrink-0 text-on-surface-variant/30 group-hover:text-ds-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                ))}
              </div>
            ) : (
              <div className="glass-panel rounded-xl p-6 text-center">
                <p className="text-sm text-on-surface-variant">Боломж олдсонгүй. Боломжууд хуудаснаас хайна уу.</p>
              </div>
            )}
          </section>
        </div>

        <ProfileSidebar userName={user.name} email={email} joinDate={joinDate} />
      </div>
    </div>
  );
};

export default ProfilePage;
