import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { BookmarkButton } from '@/components/features/BookmarkButton';
import { prisma } from '@/lib/prisma';

interface Props {
  params: Promise<{ id: string }>;
}

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

const SUBJECT_LABELS: Record<string, string> = {
  STEM: 'STEM',
  SCIENCE: 'Шинжлэх ухаан',
  TECHNOLOGY: 'Технологи',
  MATHEMATICS: 'Математик',
  COMPUTER_SCIENCE: 'Компьютерийн ухаан',
  ENGINEERING: 'Инженерчлэл',
  ARTS: 'Урлаг',
  HUMANITIES: 'Хүмүүнлэг',
  SOCIAL_SCIENCE: 'Нийгмийн шинжлэх ухаан',
  BUSINESS: 'Бизнес',
  LAW: 'Хууль',
  MEDICINE: 'Анагаах ухаан',
  ENVIRONMENT: 'Байгаль орчин',
  DESIGN: 'Дизайн',
  EDUCATION: 'Боловсрол',
  OTHER: 'Бусад',
};

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
    title: `${opp.title} | Lumina Academy`,
    description: opp.description.substring(0, 160),
  };
};

const formatDate = (date: Date | null) => {
  if (!date) return null;
  return new Intl.DateTimeFormat('mn-MN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

export default async function OpportunityDetailPage({ params }: Props) {
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
      <Link
        href="/discovery"
        className="animate-fade-in mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-on-surface-variant transition-colors hover:text-ds-primary"
      >
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
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Буцах
      </Link>

      <article className="glass-panel animate-fade-up rounded-2xl p-8">
        {/* Header: type badge + bookmark */}
        <div className="mb-5 flex items-center justify-between">
          <span
            className={`rounded-full px-3.5 py-1 text-xs font-bold ${
              TYPE_BADGE_CLASSES[opportunity.type] ??
              TYPE_BADGE_CLASSES.OTHER
            }`}
          >
            {TYPE_LABELS[opportunity.type] ?? opportunity.type}
          </span>
          <BookmarkButton opportunityId={opportunity.id} initialSaved={false} />
        </div>

        {/* Title */}
        <h1 className="heading-display text-2xl font-bold text-on-surface md:text-3xl">
          {displayTitle}
        </h1>

        {/* Subject pills */}
        {opportunity.subjects.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {opportunity.subjects.map((subject) => (
              <span
                key={subject}
                className="rounded-full bg-surface-container-highest px-3 py-1 text-xs font-medium text-on-surface-variant"
              >
                {SUBJECT_LABELS[subject] ?? subject}
              </span>
            ))}
          </div>
        )}

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
}

/* ─── Helper ─────────────────────────────────────────────────────────────── */

interface MetaItemProps {
  label: string;
  value: string;
}

const MetaItem = ({ label, value }: MetaItemProps) => (
  <div className="rounded-xl bg-surface-container p-3">
    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant/60">
      {label}
    </p>
    <p className="mt-1 text-sm font-semibold text-on-surface">{value}</p>
  </div>
);
