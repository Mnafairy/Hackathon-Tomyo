import Link from 'next/link';

import { BookmarkButton } from '@/components/features/BookmarkButton';
import { TYPE_LABELS, TYPE_BADGE_CLASSES } from '@/features/saved/saved-data';

interface SavedItem {
  id: string;
  opportunity: {
    id: string;
    title: string;
    description: string;
    type: string;
    source: { name: string };
  };
}

interface SavedCardProps {
  item: SavedItem;
  delayClass: string;
}

export const SavedCard = ({ item, delayClass }: SavedCardProps) => {
  return (
    <div
      className={`glass-card glow-border animate-fade-up rounded-2xl p-5 ${delayClass}`}
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
  );
};
