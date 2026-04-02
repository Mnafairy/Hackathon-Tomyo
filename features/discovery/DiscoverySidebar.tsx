'use client';

import { cn } from '@/lib/utils';

import { SUBJECT_OPTIONS, TYPE_OPTIONS } from './discovery-data';

interface DiscoverySidebarProps {
  checkedSubjects: string[];
  activeType: string | null;
  total: number;
  toggleSubject: (subject: string) => void;
  handleTypeToggle: (type: string) => void;
  applyFilters: () => void;
}

export const DiscoverySidebar = ({
  checkedSubjects,
  activeType,
  total,
  toggleSubject,
  handleTypeToggle,
  applyFilters,
}: DiscoverySidebarProps) => {
  return (
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
  );
};
