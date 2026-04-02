'use client';

import { cn } from '@/lib/utils';

interface SearchBarProps {
  search: string;
  setSearch: (value: string) => void;
  handleSearch: () => void;
}

export const SearchBar = ({ search, setSearch, handleSearch }: SearchBarProps) => {
  return (
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
  );
};
