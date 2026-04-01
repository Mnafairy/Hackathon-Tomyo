import { getServerSession } from 'next-auth';
import Link from 'next/link';
import type { Metadata } from 'next';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { BookmarkButton } from '@/components/features/BookmarkButton';

export const metadata: Metadata = {
  title: 'Хадгалсан | Lumina Academy',
};

const TYPE_LABELS: Record<string, string> = {
  SCHOLARSHIP: 'Тэтгэлэг',
  JOB: 'Ажлын байр',
  GRANT: 'Грант',
  INTERNSHIP: 'Дадлага',
  COMPETITION: 'Тэмцээн',
  OTHER: 'Бусад',
};

const TYPE_BADGE_CLASSES: Record<string, string> = {
  COMPETITION: 'bg-ds-primary-container text-on-primary-container',
  SCHOLARSHIP: 'bg-tertiary-container text-on-tertiary-container',
  GRANT: 'bg-secondary-container text-on-secondary-container',
  INTERNSHIP: 'bg-ds-tertiary/20 text-ds-tertiary',
  JOB: 'bg-surface-container-highest text-on-surface',
  OTHER: 'bg-surface-container text-on-surface-variant',
};

const DELAY_CLASSES = [
  'delay-0',
  'delay-1',
  'delay-2',
  'delay-3',
  'delay-4',
  'delay-5',
  'delay-6',
  'delay-7',
];

export default async function SavedPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="glass-panel animate-fade-up mx-auto max-w-md rounded-2xl p-10 text-center">
          <svg
            className="mx-auto mb-4 h-12 w-12 text-ds-primary/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
          <h2 className="heading-section text-xl font-bold text-on-surface">
            Нэвтрэх шаардлагатай
          </h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Хадгалсан боломжуудаа харахын тулд нэвтэрнэ үү.
          </p>
          <Link
            href="/login"
            className="btn-glow mt-6 inline-flex rounded-full bg-gradient-to-r from-ds-primary to-ds-secondary px-6 py-2.5 text-sm font-bold text-on-primary-fixed shadow-lg shadow-ds-primary/20"
          >
            Нэвтрэх
          </Link>
        </div>
      </div>
    );
  }

  const savedItems = await prisma.savedOpportunity.findMany({
    where: { userId: session.user.id },
    include: {
      opportunity: {
        include: { source: true },
      },
    },
    orderBy: { savedAt: 'desc' },
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Header */}
      <div className="animate-fade-up mb-10">
        <h1 className="heading-section text-3xl font-bold tracking-tight text-on-surface md:text-4xl">
          Хадгалсан боломжууд
        </h1>
        <div className="accent-line mt-3" />
      </div>

      {/* Empty state */}
      {savedItems.length === 0 && (
        <div className="glass-panel animate-fade-up mx-auto max-w-md rounded-2xl p-10 text-center">
          <svg
            className="mx-auto mb-4 h-16 w-16 text-on-surface-variant/30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
          <p className="text-on-surface-variant">
            Одоогоор хадгалсан боломж байхгүй байна.
          </p>
          <Link
            href="/discovery"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ds-primary transition-colors hover:text-ds-secondary"
          >
            Боломжууд хайх
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      )}

      {/* Cards grid */}
      {savedItems.length > 0 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {savedItems.map((item, i) => (
            <div
              key={item.id}
              className={`glass-card glow-border animate-fade-up rounded-2xl p-5 ${
                DELAY_CLASSES[i % 8]
              }`}
            >
              {/* Header: badge + bookmark */}
              <div className="mb-3 flex items-center justify-between">
                <span
                  className={`rounded-md px-2.5 py-0.5 text-xs font-semibold ${
                    TYPE_BADGE_CLASSES[item.opportunity.type] ??
                    TYPE_BADGE_CLASSES.OTHER
                  }`}
                >
                  {TYPE_LABELS[item.opportunity.type] ??
                    item.opportunity.type}
                </span>
                <BookmarkButton
                  opportunityId={item.opportunity.id}
                  initialSaved={true}
                />
              </div>

              {/* Title */}
              <Link href={`/discovery/${item.opportunity.id}`}>
                <h3 className="line-clamp-2 text-[15px] font-bold text-on-surface transition-colors hover:text-ds-primary">
                  {item.opportunity.title}
                </h3>
              </Link>

              {/* Description */}
              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-on-surface-variant/70">
                {item.opportunity.description}
              </p>

              {/* Bottom */}
              <div className="relative mt-5 pt-3.5">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-outline-variant/50 to-transparent" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-on-surface">
                    {item.opportunity.source.name}
                  </span>
                  <Link
                    href={`/discovery/${item.opportunity.id}`}
                    className="flex items-center gap-1 text-xs font-bold text-ds-primary"
                  >
                    Дэлгэрэнгүй
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
