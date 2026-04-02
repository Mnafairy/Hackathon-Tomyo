'use client';

import { cn } from '@/lib/utils';

const INTEREST_OPTIONS = [
  'STEM', 'Математик', 'Физик', 'Программчлал',
  'Биологи', 'Англи хэл', 'Урлаг', 'Бизнес',
];

interface InterestsSectionProps {
  interests: string[];
  toggleInterest: (interest: string) => void;
}

export const InterestsSection = ({ interests, toggleInterest }: InterestsSectionProps) => {
  return (
    <section className="animate-fade-up delay-1 glass-panel glow-border rounded-2xl p-6">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-on-surface-variant/60">
        Сонирхлын чиглэлүүд
      </h2>
      <div className="flex flex-wrap gap-2">
        {INTEREST_OPTIONS.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleInterest(tag)}
            className={cn(
              'rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200',
              interests.includes(tag)
                ? 'bg-gradient-to-r from-ds-primary/25 to-ds-secondary/25 text-ds-primary ring-1 ring-ds-primary/30'
                : 'bg-surface-container-highest/60 text-on-surface-variant hover:bg-surface-container-highest',
            )}
          >
            {tag}
          </button>
        ))}
      </div>
      {interests.length > 0 && (
        <p className="mt-4 text-xs text-on-surface-variant/50">
          {interests.length} чиглэл сонгосон
        </p>
      )}
    </section>
  );
};
