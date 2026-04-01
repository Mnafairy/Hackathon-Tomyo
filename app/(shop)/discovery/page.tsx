'use client';

import { useState, useEffect, useCallback } from 'react';

import { cn } from '@/lib/utils';

const SUBJECT_OPTIONS = [
  { key: 'MATHEMATICS', label: 'Математик' },
  { key: 'COMPUTER_SCIENCE', label: 'Мэдээллийн технологи' },
  { key: 'SCIENCE', label: 'Шинжлэх ухаан' },
  { key: 'ENGINEERING', label: 'Инженерчлэл' },
  { key: 'ARTS', label: 'Урлаг' },
  { key: 'HUMANITIES', label: 'Хүмүүнлэг' },
  { key: 'STEM', label: 'STEM' },
  { key: 'BUSINESS', label: 'Бизнес' },
];

const TYPE_OPTIONS = [
  { key: 'COMPETITION', label: 'Тэмцээн' },
  { key: 'SCHOLARSHIP', label: 'Тэтгэлэг' },
  { key: 'GRANT', label: 'Грант' },
  { key: 'INTERNSHIP', label: 'Дадлага' },
  { key: 'JOB', label: 'Ажлын байр' },
];

const TYPE_BADGE_CLASSES: Record<string, string> = {
  COMPETITION: 'bg-ds-primary-container text-on-primary-container',
  SCHOLARSHIP: 'bg-tertiary-container text-on-tertiary-container',
  GRANT: 'bg-secondary-container text-on-secondary-container',
  INTERNSHIP: 'bg-ds-tertiary/20 text-ds-tertiary',
  JOB: 'bg-surface-container-highest text-on-surface',
  OTHER: 'bg-surface-container text-on-surface-variant',
};

const TYPE_LABELS: Record<string, string> = {
  COMPETITION: 'Тэмцээн',
  SCHOLARSHIP: 'Тэтгэлэг',
  GRANT: 'Грант',
  INTERNSHIP: 'Дадлага',
  JOB: 'Ажлын байр',
  OTHER: 'Бусад',
};

const SUBJECT_LABELS: Record<string, string> = {
  MATHEMATICS: 'Math',
  COMPUTER_SCIENCE: 'CS',
  SCIENCE: 'Science',
  ENGINEERING: 'Eng',
  ARTS: 'Arts',
  HUMANITIES: 'Hum',
  STEM: 'STEM',
  BUSINESS: 'Biz',
  TECHNOLOGY: 'Tech',
  EDUCATION: 'Edu',
  MEDICINE: 'Med',
  OTHER: 'Other',
};

interface Opportunity {
  id: string;
  title: string;
  description: string;
  originalUrl: string;
  imageUrl: string | null;
  type: string;
  subjects: string[];
  minAge: number | null;
  maxAge: number | null;
  scrapedAt: string;
  sourceName: string;
}

const DELAY_CLASSES = [
  'delay-0', 'delay-1', 'delay-2', 'delay-3',
  'delay-4', 'delay-5', 'delay-6', 'delay-7',
];

const DiscoveryPage = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [checkedSubjects, setCheckedSubjects] = useState<string[]>([]);
  const [activeType, setActiveType] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchData = useCallback(
    (type: string | null, query: string, subject: string | null) => {
      setLoading(true);
      const params = new URLSearchParams();
      if (type) params.set('type', type);
      if (query) params.set('search', query);
      if (subject) params.set('subject', subject);

      fetch(`/api/opportunities?${params}`)
        .then((res) => res.json())
        .then((json) => {
          setOpportunities(json.opportunities ?? []);
          setTotal(json.total ?? 0);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    },
    [],
  );

  useEffect(() => {
    fetchData(null, '', null);
  }, [fetchData]);

  const toggleSubject = (subject: string) => {
    setCheckedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject],
    );
  };

  const handleTypeToggle = (type: string) => {
    const next = activeType === type ? null : type;
    setActiveType(next);
    const sub = checkedSubjects.length === 1 ? checkedSubjects[0] : null;
    fetchData(next, search, sub);
  };

  const handleSearch = () => {
    const sub = checkedSubjects.length === 1 ? checkedSubjects[0] : null;
    fetchData(activeType, search, sub);
  };

  const applyFilters = () => {
    const sub = checkedSubjects.length === 1 ? checkedSubjects[0] : null;
    fetchData(activeType, search, sub);
  };

  const handleScrape = async () => {
    setScraping(true);
    try {
      await fetch('/api/scrape', { method: 'POST' });
      fetchData(activeType, search, null);
    } finally {
      setScraping(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Page Header */}
      <div className="heading-section animate-fade-up mb-10 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface md:text-4xl">
            Боломжууд
          </h1>
          <div className="accent-line mt-3" />
          <p className="mt-4 max-w-xl text-sm text-on-surface-variant">
            Тэтгэлэг, тэмцээн, хөтөлбөр болон бусад боломжууд. AI ашиглан
            шүүж, ангилсан.
          </p>
        </div>
        <button
          onClick={handleScrape}
          disabled={scraping}
          className="btn-glow flex-shrink-0 rounded-full bg-gradient-to-r from-ds-primary to-ds-secondary px-5 py-2 text-sm font-semibold text-on-primary-fixed shadow-lg shadow-ds-primary/20 disabled:opacity-50"
        >
          {scraping ? 'Шинэчилж байна...' : 'Мэдээ шинэчлэх'}
        </button>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Left Sidebar */}
        <aside className="w-full flex-shrink-0 md:w-72">
          <div className="glass-panel sticky top-24 space-y-6 rounded-2xl p-5">
            {/* Subjects */}
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-on-surface-variant/60">
                Хичээлийн чиглэл
              </h3>
              <div className="space-y-1">
                {SUBJECT_OPTIONS.map((subject) => (
                  <label
                    key={subject.key}
                    className={cn(
                      'flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition',
                      'hover:bg-surface-container-high/30',
                      checkedSubjects.includes(subject.key)
                        ? 'text-on-surface'
                        : 'text-on-surface-variant',
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checkedSubjects.includes(subject.key)}
                      onChange={() => toggleSubject(subject.key)}
                      className="h-4 w-4 rounded accent-ds-primary"
                    />
                    {subject.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Opportunity Types */}
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-on-surface-variant/60">
                Боломжийн төрөл
              </h3>
              <div className="flex flex-wrap gap-2">
                {TYPE_OPTIONS.map((type) => (
                  <button
                    key={type.key}
                    onClick={() => handleTypeToggle(type.key)}
                    className={cn(
                      'glow-border rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-300',
                      activeType === type.key
                        ? 'border border-ds-primary/30 bg-gradient-to-r from-ds-primary/20 to-ds-secondary/20 text-ds-primary'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high',
                    )}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Apply Filters */}
            <button
              onClick={applyFilters}
              className="w-full rounded-xl bg-secondary-container py-2.5 text-sm font-bold text-on-secondary-container transition-all hover:opacity-80"
            >
              Шүүлт хийх
            </button>

            {/* Stats */}
            <div className="rounded-xl border border-ds-primary/10 bg-gradient-to-br from-ds-primary/5 to-ds-tertiary/5 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-ds-primary/70">
                Нийт боломж
              </p>
              <p className="mt-1 text-2xl font-black text-on-surface">
                {total}
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Search Bar */}
          <div className="animate-fade-up mb-8">
            <div
              className={cn(
                'glass-panel flex items-center gap-3 rounded-2xl px-5 py-3.5 transition-all duration-300',
                'focus-within:border-ds-primary/30 focus-within:shadow-[0_0_30px_rgba(255,122,197,0.08)]',
              )}
            >
              <svg
                className="h-5 w-5 flex-shrink-0 text-ds-primary/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Тэтгэлэг, тэмцээн, дадлага хайх..."
                className="flex-1 bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none"
              />
              <button
                onClick={handleSearch}
                className="rounded-lg bg-ds-primary px-5 py-2 text-sm font-bold text-on-primary-fixed transition-all hover:opacity-90 active:scale-95"
              >
                Хайх
              </button>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass-card animate-pulse rounded-2xl p-5">
                  <div className="mb-3 h-5 w-20 rounded bg-surface-container-highest" />
                  <div className="mb-2 h-5 w-full rounded bg-surface-container-highest" />
                  <div className="h-4 w-3/4 rounded bg-surface-container-highest" />
                  <div className="mt-5 h-px bg-outline-variant/30" />
                  <div className="mt-3 h-4 w-1/2 rounded bg-surface-container-highest" />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && opportunities.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <svg className="mb-4 h-16 w-16 text-on-surface-variant/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <p className="text-on-surface-variant">Боломж олдсонгүй</p>
              <button
                onClick={handleScrape}
                disabled={scraping}
                className="mt-4 rounded-full bg-ds-primary px-6 py-2 text-sm font-bold text-on-primary-fixed disabled:opacity-50"
              >
                {scraping ? 'Шинэчилж байна...' : 'Мэдээ татах'}
              </button>
            </div>
          )}

          {/* Cards Grid */}
          {!loading && opportunities.length > 0 && (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {opportunities.map((item, i) => (
                <a
                  key={item.id}
                  href={item.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'glass-card glow-border animate-fade-up group rounded-2xl p-5',
                    DELAY_CLASSES[i % 8],
                  )}
                >
                  {/* Image or gradient fallback */}
                  <div className="mb-4 h-40 overflow-hidden rounded-xl">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          target.parentElement?.classList.add(
                            'bg-gradient-to-br',
                            'from-ds-primary/20',
                            'via-ds-secondary/10',
                            'to-ds-tertiary/20',
                          );
                        }}
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

                  {/* Top: badges */}
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      <span
                        className={cn(
                          'rounded-md px-2.5 py-0.5 text-xs font-semibold',
                          TYPE_BADGE_CLASSES[item.type] ?? TYPE_BADGE_CLASSES.OTHER,
                        )}
                      >
                        {TYPE_LABELS[item.type] ?? item.type}
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
                  </div>

                  {/* Title */}
                  <h3 className="line-clamp-2 text-[15px] font-bold text-on-surface group-hover:text-ds-primary transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  {item.description && (
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-on-surface-variant/70">
                      {item.description}
                    </p>
                  )}

                  {/* Bottom */}
                  <div className="relative mt-5 pt-3.5">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-outline-variant/50 to-transparent" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-on-surface">
                        {item.sourceName}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-bold text-ds-primary">
                        Дэлгэрэнгүй
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscoveryPage;
