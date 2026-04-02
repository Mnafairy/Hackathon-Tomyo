'use client';

import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="glass-panel animate-fade-up mx-auto max-w-md rounded-2xl p-10">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-ds-error/10">
          <svg
            className="h-8 w-8 text-ds-error"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>

        <h2 className="mb-2 text-xl font-bold text-on-surface">Алдаа гарлаа</h2>
        <p className="mb-6 text-sm text-on-surface-variant">
          Уучлаарай, ямар нэгэн алдаа гарлаа. Дахин оролдоно уу.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-full bg-gradient-to-r from-ds-primary to-ds-secondary px-5 py-2.5 text-sm font-semibold text-on-primary-fixed transition-shadow hover:shadow-lg hover:shadow-ds-primary/20"
          >
            Дахин оролдох
          </button>
          <Link
            href="/"
            className="rounded-full border border-outline-variant px-5 py-2.5 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container"
          >
            Нүүр хуудас
          </Link>
        </div>
      </div>
    </div>
  );
}
