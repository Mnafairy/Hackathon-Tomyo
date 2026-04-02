'use client';

import { format } from 'date-fns';
import { mn } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface ProjectSettingsProps {
  minAge: number;
  setMinAge: (age: number) => void;
  maxAge: number;
  setMaxAge: (age: number) => void;
  deadline: string;
  setDeadline: (deadline: string) => void;
  handlePublish: () => void;
  submitting: boolean;
  title: string;
  description: string;
}

export const ProjectSettings = ({
  minAge,
  setMinAge,
  maxAge,
  setMaxAge,
  deadline,
  setDeadline,
  handlePublish,
  submitting,
  title,
  description,
}: ProjectSettingsProps) => {
  const router = useRouter();

  return (
    <div className="space-y-6 lg:col-span-2">
      {/* Target Demographic */}
      <section className="animate-fade-up delay-2 glass-panel glow-border rounded-2xl p-6">
        <h2 className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-on-surface-variant/60">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Зорилтот бүлэг
        </h2>

        <div className="space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">
                Насны хязгаар
              </span>
              <span className="text-sm font-bold text-ds-primary">
                {minAge} – {maxAge} нас
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={10}
                max={30}
                value={minAge}
                onChange={(e) => setMinAge(Math.min(Number(e.target.value), maxAge - 1))}
                className="h-1.5 w-full appearance-none rounded-full bg-surface-container-highest accent-ds-primary"
              />
              <input
                type="range"
                min={10}
                max={30}
                value={maxAge}
                onChange={(e) => setMaxAge(Math.max(Number(e.target.value), minAge + 1))}
                className="h-1.5 w-full appearance-none rounded-full bg-surface-container-highest accent-ds-primary"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Deadline */}
      <section className="animate-fade-up delay-3 glass-panel glow-border rounded-2xl p-6">
        <h2 className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-on-surface-variant/60">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Эцсийн хугацаа
        </h2>
        <Popover>
          <PopoverTrigger
            className={cn(
              'flex w-full items-center gap-3 rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm transition-all hover:border-outline focus:border-ds-primary focus:outline-none focus:ring-1 focus:ring-ds-primary/30',
              deadline ? 'text-on-surface' : 'text-on-surface-variant/40',
            )}
          >
            <CalendarIcon className="h-4 w-4 shrink-0 text-on-surface-variant/60" />
            {deadline
              ? format(new Date(deadline), 'yyyy оны MM сарын dd', { locale: mn })
              : 'Огноо сонгох'}
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              mode="single"
              selected={deadline ? new Date(deadline) : undefined}
              onSelect={(date) => {
                if (date) {
                  const y = date.getFullYear();
                  const m = String(date.getMonth() + 1).padStart(2, '0');
                  const d = String(date.getDate()).padStart(2, '0');
                  setDeadline(`${y}-${m}-${d}`);
                } else {
                  setDeadline('');
                }
              }}
              disabled={{ before: new Date() }}
              locale={mn}
            />
          </PopoverContent>
        </Popover>
        <p className="mt-2 text-xs text-on-surface-variant/50">
          Хоосон орхивол хугацаагүй гэж тэмдэглэнэ
        </p>
      </section>

      {/* Publish Actions */}
      <div className="animate-fade-up delay-4 space-y-3">
        <button
          onClick={handlePublish}
          disabled={!title.trim() || !description.trim() || submitting}
          className="btn-glow w-full rounded-xl bg-gradient-to-r from-ds-primary to-ds-secondary py-4 text-base font-bold text-white shadow-xl shadow-ds-primary/20 transition-all hover:scale-[1.01] hover:shadow-[0_0_40px_rgba(255,122,197,0.25)] disabled:opacity-50 disabled:hover:scale-100"
        >
          {submitting ? 'Нийтлэж байна...' : 'Төсөл нийтлэх'}
        </button>

        <button
          onClick={() => router.push('/discovery')}
          className="w-full rounded-xl border border-outline-variant py-3 text-sm font-semibold text-on-surface-variant transition-all hover:border-outline hover:text-on-surface"
        >
          Болих
        </button>

        <p className="text-center text-[10px] leading-relaxed text-on-surface-variant/40">
          Нийтлэснээр та Peony-ийн академик шударга байдлын
          удирдамж болон нийгэмлэгийн стандартыг зөвшөөрч байна.
        </p>
      </div>
    </div>
  );
};
