'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

import {
  TYPE_BADGE_CLASSES,
  TYPE_LABELS,
  SUBJECT_LABELS,
  STATUS_BADGE_CLASSES,
  STATUS_LABELS,
} from './discovery-data';
import type { Opportunity } from './discovery-data';

interface TranslationData {
  title: string;
  description: string;
  summary: string | null;
}

interface OpportunityModalProps {
  item: Opportunity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OpportunityModal = ({ item, open, onOpenChange }: OpportunityModalProps) => {
  const [translation, setTranslation] = useState<TranslationData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!item || !open) {
      setTranslation(null);
      return;
    }
    // Only fetch translation for non-Mongolian content
    if (item.originalLang && item.originalLang !== 'mn') {
      setLoading(true);
      fetch(`/api/opportunities/${item.id}`)
        .then((res) => res.json())
        .then((data) => setTranslation(data.translations?.[0] ?? null))
        .catch(() => setTranslation(null))
        .finally(() => setLoading(false));
    }
  }, [item, open]);

  if (!item) return null;

  const displayTitle = translation?.title ?? item.title;
  const displayDescription = translation?.description ?? item.description;
  const summary = translation?.summary ?? null;

  const deadline = item.deadline
    ? new Date(item.deadline).toLocaleDateString('mn-MN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[90dvh] flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-[620px]"
        showCloseButton={false}
      >
        {/* ── Top bar ── */}
        <div className="flex shrink-0 items-center justify-between border-b border-outline-variant/10 px-5 py-3">
          <span className="text-xs font-medium text-on-surface-variant">
            {item.sourceName}
          </span>
          <div className="flex items-center gap-2">
            {item.originalUrl.startsWith('http') && (
              <a
                href={item.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg border border-outline-variant/30 px-3 py-1.5 text-xs font-semibold text-on-surface transition-colors hover:bg-surface-container-high"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                Нийтлэл унших
              </a>
            )}
            <button
              onClick={() => onOpenChange(false)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-6">
          {/* Title */}
          <DialogTitle className="text-xl font-bold leading-snug text-on-surface">
            {displayTitle}
          </DialogTitle>

          {/* AI Summary — TLDR style */}
          {loading && (
            <div className="mt-4 rounded-xl bg-surface-container p-4">
              <div className="flex items-center gap-2">
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-ds-primary border-t-transparent" />
                <span className="text-xs font-medium text-on-surface-variant">Хураангуй ачааллаж байна...</span>
              </div>
            </div>
          )}

          {!loading && summary && (
            <div className="mt-4 rounded-xl bg-surface-container p-4">
              <div className="mb-2 flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 text-ds-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-[11px] font-bold uppercase tracking-wider text-ds-primary">TLDR</span>
              </div>
              <p className="text-sm leading-relaxed text-on-surface/90">{summary}</p>
            </div>
          )}

          {/* Description */}
          {displayDescription && (
            <p className="mt-4 whitespace-pre-line text-sm leading-[1.7] text-on-surface-variant">
              {displayDescription}
            </p>
          )}

          {/* Tags */}
          {item.subjects.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {item.subjects.map((s) => (
                <span
                  key={s}
                  className="rounded-lg border border-outline-variant/30 px-2.5 py-1 text-xs text-on-surface-variant"
                >
                  #{SUBJECT_LABELS[s] ?? s}
                </span>
              ))}
            </div>
          )}

          {/* Meta line */}
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-on-surface-variant/70">
            {deadline && (
              <span className="flex items-center gap-1">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {deadline}
              </span>
            )}
            {deadline && (item.minAge || item.maxAge) && <span>·</span>}
            {(item.minAge || item.maxAge) && (
              <span>
                {item.minAge && item.maxAge
                  ? `${item.minAge}–${item.maxAge} нас`
                  : item.minAge ? `${item.minAge}+ нас` : `${item.maxAge} хүртэл`}
              </span>
            )}
            <span>·</span>
            <span>{item.sourceName}</span>
          </div>

          {/* Image — inline, below content like daily.dev */}
          {item.imageUrl && (
            <div className="relative mt-5 aspect-video overflow-hidden rounded-xl">
              <Image
                src={item.imageUrl}
                alt={displayTitle}
                fill
                sizes="(max-width: 640px) 100vw, 560px"
                className="object-cover"
              />
            </div>
          )}
        </div>

        {/* ── Bottom action bar ── */}
        <div className="flex shrink-0 items-center gap-3 border-t border-outline-variant/10 px-5 py-3 sm:px-8">
          <div className="flex flex-wrap gap-1.5">
            <span className={cn('rounded-md px-2 py-0.5 text-[11px] font-bold', TYPE_BADGE_CLASSES[item.type] ?? TYPE_BADGE_CLASSES.OTHER)}>
              {TYPE_LABELS[item.type] ?? item.type}
            </span>
            <span className={cn('rounded-md px-2 py-0.5 text-[11px] font-bold', STATUS_BADGE_CLASSES[item.status] ?? STATUS_BADGE_CLASSES.UNKNOWN)}>
              {STATUS_LABELS[item.status] ?? 'Тодорхойгүй'}
            </span>
          </div>
          {item.originalUrl.startsWith('http') && (
            <div className="ml-auto">
              <a
                href={item.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg bg-ds-primary px-4 py-2 text-xs font-bold text-on-primary transition-colors hover:bg-ds-primary/90"
              >
                Эх сурвалж
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
