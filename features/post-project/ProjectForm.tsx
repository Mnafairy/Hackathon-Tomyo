'use client';

import { cn } from '@/lib/utils';

import { SUBJECT_OPTIONS, TYPE_OPTIONS } from '@/features/post-project/post-project-data';

interface ProjectFormProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  link: string;
  setLink: (link: string) => void;
  type: string;
  setType: (type: string) => void;
  subjects: string[];
  toggleSubject: (subject: string) => void;
}

export const ProjectForm = ({
  title,
  setTitle,
  description,
  setDescription,
  link,
  setLink,
  type,
  setType,
  subjects,
  toggleSubject,
}: ProjectFormProps) => {
  const linkError = link && !/^https?:\/\//.test(link);
  return (
    <div className="space-y-6 lg:col-span-3">
      {/* Project Identity */}
      <section className="animate-fade-up delay-1 glass-panel glow-border rounded-2xl p-6">
        <h2 className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-ds-primary">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Төслийн мэдээлэл
        </h2>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">
              Төслийн нэр
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Жишээ нь: Ахлах ангийн сурагчдад зориулсан хакатон"
              className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:border-ds-primary focus:outline-none focus:ring-1 focus:ring-ds-primary/30 transition-all"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">
              Дэлгэрэнгүй тайлбар
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              placeholder="Төслийн зорилго, шаардлага, оролцогчид юу сурах талаар бичнэ үү..."
              className="w-full resize-none rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:border-ds-primary focus:outline-none focus:ring-1 focus:ring-ds-primary/30 transition-all"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">
              Холбоос (заавал биш)
            </label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://example.com/apply"
              className={cn(
                'w-full rounded-xl border bg-surface-container-low px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 transition-all',
                linkError
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
                  : 'border-outline-variant focus:border-ds-primary focus:ring-ds-primary/30',
              )}
            />
            {linkError && (
              <p className="mt-1.5 text-xs text-red-500">Зөв холбоос оруулна уу (https://...)</p>
            )}
          </div>
        </div>
      </section>

      {/* Opportunity Type */}
      <section className="animate-fade-up delay-2 glass-panel glow-border rounded-2xl p-6">
        <h2 className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-ds-secondary">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Боломжийн төрөл
        </h2>

        <div className="flex flex-wrap gap-2">
          {TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setType(opt.value)}
              className={cn(
                'rounded-xl border px-4 py-2.5 text-sm font-medium transition-all',
                type === opt.value
                  ? 'border-ds-secondary/40 bg-ds-secondary/10 text-ds-secondary'
                  : 'border-outline-variant bg-surface-container-low text-on-surface-variant hover:border-outline hover:text-on-surface',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* Subject Classification */}
      <section className="animate-fade-up delay-3 glass-panel glow-border rounded-2xl p-6">
        <h2 className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-ds-tertiary">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Чиглэл
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {SUBJECT_OPTIONS.map((subject) => (
            <label
              key={subject.value}
              className={cn(
                'flex cursor-pointer items-center gap-2.5 rounded-xl border px-4 py-3 text-sm transition-all duration-200',
                subjects.includes(subject.value)
                  ? 'border-ds-primary/40 bg-ds-primary/10 text-ds-primary'
                  : 'border-outline-variant bg-surface-container-low text-on-surface-variant hover:border-outline hover:text-on-surface',
              )}
            >
              <input
                type="checkbox"
                checked={subjects.includes(subject.value)}
                onChange={() => toggleSubject(subject.value)}
                className="sr-only"
              />
              <div
                className={cn(
                  'flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all',
                  subjects.includes(subject.value)
                    ? 'border-ds-primary bg-ds-primary'
                    : 'border-outline-variant',
                )}
              >
                {subjects.includes(subject.value) && (
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              {subject.label}
            </label>
          ))}
        </div>
      </section>
    </div>
  );
};
