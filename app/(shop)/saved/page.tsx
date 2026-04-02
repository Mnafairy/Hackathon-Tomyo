import { getServerSession } from 'next-auth';
import Link from 'next/link';
import type { Metadata } from 'next';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DELAY_CLASSES } from '@/features/saved/saved-data';
import { SavedCard } from '@/features/saved/SavedCard';
import { LoginPrompt } from '@/features/saved/LoginPrompt';

export const metadata: Metadata = {
  title: 'Хадгалсан | Peony',
};

const SavedPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <LoginPrompt />;
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
            <SavedCard key={item.id} item={item} delayClass={DELAY_CLASSES[i % 8]} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPage;
