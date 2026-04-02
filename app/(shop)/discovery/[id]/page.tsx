import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { prisma } from '@/lib/prisma';
import { DetailHeader } from '@/features/discovery/DetailHeader';
import { MetaItem } from '@/features/discovery/MetaItem';
import { formatDate } from '@/features/discovery/detail-data';

interface Props {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { id } = await params;
  const opp = await prisma.opportunity.findUnique({
    where: { id },
    select: { title: true, description: true },
  });
  if (!opp) return { title: 'Олдсонгүй' };
  return {
    title: `${opp.title} | Peony`,
    description: opp.description.substring(0, 160),
  };
};

const OpportunityDetailPage = async ({ params }: Props) => {
  const { id } = await params;

  const opportunity = await prisma.opportunity.findUnique({
    where: { id },
    include: {
      source: true,
      translations: {
        where: { targetLang: 'mn', status: 'COMPLETED' },
        take: 1,
      },
    },
  });

  if (!opportunity) notFound();

  const translation = opportunity.translations[0] ?? null;
  const displayTitle = translation?.title ?? opportunity.title;
  const displayDescription =
    translation?.description ?? opportunity.description;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <article className="glass-panel animate-fade-up rounded-2xl p-8">
        <DetailHeader
          opportunityId={opportunity.id}
          opportunityType={opportunity.type}
          subjects={opportunity.subjects}
          displayTitle={displayTitle}
        />

        {/* Gradient divider */}
        <div className="my-6 h-px bg-gradient-to-r from-transparent via-outline-variant/50 to-transparent" />

        {/* Description */}
        <div className="whitespace-pre-line text-sm leading-relaxed text-on-surface-variant">
          {displayDescription}
        </div>

        {/* AI Summary */}
        {translation?.summary && (
          <div className="mt-6 rounded-xl border border-ds-primary/10 bg-ds-primary/5 p-5">
            <div className="mb-2 flex items-center gap-2">
              <svg
                className="h-4 w-4 text-ds-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span className="text-xs font-bold uppercase tracking-wider text-ds-primary">
                AI хураангуй
              </span>
            </div>
            <p className="text-sm leading-relaxed text-on-surface">
              {translation.summary}
            </p>
          </div>
        )}

        {/* Metadata grid */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          {opportunity.organization && (
            <MetaItem label="Байгууллага" value={opportunity.organization} />
          )}
          <MetaItem label="Эх сурвалж" value={opportunity.source.name} />
          {(opportunity.minAge || opportunity.maxAge) && (
            <MetaItem
              label="Насны хязгаар"
              value={
                opportunity.minAge && opportunity.maxAge
                  ? `${opportunity.minAge} - ${opportunity.maxAge} нас`
                  : opportunity.minAge
                    ? `${opportunity.minAge}+ нас`
                    : `${opportunity.maxAge} хүртэл нас`
              }
            />
          )}
          {opportunity.deadline && (
            <MetaItem
              label="Эцсийн хугацаа"
              value={formatDate(opportunity.deadline) ?? ''}
            />
          )}
        </div>

        {/* External link button */}
        <div className="mt-8">
          <a
            href={opportunity.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glow inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-ds-primary to-ds-secondary px-6 py-3 text-sm font-bold text-on-primary-fixed shadow-lg shadow-ds-primary/20 transition-all"
          >
            Эх сурвалж руу зочлох
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </article>
    </div>
  );
};

export default OpportunityDetailPage;
