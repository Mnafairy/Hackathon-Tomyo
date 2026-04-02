'use client';

import Image from 'next/image';

import { cn } from '@/lib/utils';

import {
  TYPE_BADGE_CLASSES,
  TYPE_LABELS,
  SUBJECT_LABELS,
  STATUS_BADGE_CLASSES,
  STATUS_LABELS,
} from './discovery-data';
import type { Opportunity } from './discovery-data';

interface OpportunityCardProps {
  item: Opportunity;
  delayClass: string;
  onSelect: (item: Opportunity) => void;
}

export const OpportunityCard = ({ item, delayClass, onSelect }: OpportunityCardProps) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className={cn(
        'glass-card glow-border animate-fade-up group flex h-full flex-col rounded-2xl text-left',
        delayClass,
      )}
    >
      {/* Image — fixed height, always present */}
      <div className="relative h-40 shrink-0 overflow-hidden rounded-t-2xl">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ds-primary/20 via-ds-secondary/10 to-ds-tertiary/20">
            <svg
              className="h-10 w-10 text-ds-primary/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content — flex-1 to fill remaining space */}
      <div className="flex flex-1 flex-col p-5">
        {/* Badges */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          <span
            className={cn(
              'rounded-md px-2.5 py-0.5 text-xs font-semibold',
              TYPE_BADGE_CLASSES[item.type] ?? TYPE_BADGE_CLASSES.OTHER,
            )}
          >
            {TYPE_LABELS[item.type] ?? item.type}
          </span>
          <span
            className={cn(
              'rounded-md px-2.5 py-0.5 text-xs font-semibold',
              STATUS_BADGE_CLASSES[item.status] ?? STATUS_BADGE_CLASSES.UNKNOWN,
            )}
          >
            {STATUS_LABELS[item.status] ?? 'Тодорхойгүй'}
          </span>
          {item.subjects.slice(0, 2).map((s) => (
            <span
              key={s}
              className="rounded-md bg-ds-tertiary/15 px-2.5 py-0.5 text-xs font-semibold text-ds-tertiary"
            >
              {SUBJECT_LABELS[s] ?? s}
            </span>
          ))}
        </div>

        {/* Title — fixed 2 lines */}
        <h3 className="line-clamp-2 min-h-[2.5rem] text-[15px] font-bold leading-tight text-on-surface transition-colors group-hover:text-ds-primary">
          {item.title}
        </h3>

        {/* Description — fixed 2 lines */}
        <p className="mt-1.5 line-clamp-2 min-h-[2rem] text-xs leading-relaxed text-on-surface-variant/70">
          {item.description || '\u00A0'}
        </p>

        {/* Spacer pushes footer to bottom */}
        <div className="flex-1" />

        {/* Footer — always at bottom */}
        <div className="relative mt-4 pt-3.5">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-outline-variant/50 to-transparent" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-on-surface">
                {item.sourceName}
              </span>
              {item.deadline && (
                <span className="flex items-center gap-1 text-xs text-on-surface-variant">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(item.deadline).toLocaleDateString('mn-MN')}
                </span>
              )}
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-ds-primary">
              Дэлгэрэнгүй
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};
