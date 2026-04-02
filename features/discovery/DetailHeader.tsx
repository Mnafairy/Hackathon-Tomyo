import Link from 'next/link';

import { BookmarkButton } from '@/components/features/BookmarkButton';
import {
  TYPE_LABELS,
  TYPE_BADGE_CLASSES,
  SUBJECT_LABELS,
} from '@/features/discovery/detail-data';

interface DetailHeaderProps {
  opportunityId: string;
  opportunityType: string;
  subjects: string[];
  displayTitle: string;
}

export const DetailHeader = ({
  opportunityId,
  opportunityType,
  subjects,
  displayTitle,
}: DetailHeaderProps) => (
  <>
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

    {/* Header: type badge + bookmark */}
    <div className="mb-5 flex items-center justify-between">
      <span
        className={`rounded-full px-3.5 py-1 text-xs font-bold ${
          TYPE_BADGE_CLASSES[opportunityType] ?? TYPE_BADGE_CLASSES.OTHER
        }`}
      >
        {TYPE_LABELS[opportunityType] ?? opportunityType}
      </span>
      <BookmarkButton opportunityId={opportunityId} initialSaved={false} />
    </div>

    {/* Title */}
    <h1 className="heading-display text-2xl font-bold text-on-surface md:text-3xl">
      {displayTitle}
    </h1>

    {/* Subject pills */}
    {subjects.length > 0 && (
      <div className="mt-4 flex flex-wrap gap-2">
        {subjects.map((subject) => (
          <span
            key={subject}
            className="rounded-full bg-surface-container-highest px-3 py-1 text-xs font-medium text-on-surface-variant"
          >
            {SUBJECT_LABELS[subject] ?? subject}
          </span>
        ))}
      </div>
    )}
  </>
);
