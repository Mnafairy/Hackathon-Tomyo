import Link from 'next/link';

export const LoginPrompt = () => {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <div className="glass-panel animate-fade-up mx-auto max-w-md rounded-2xl p-10 text-center">
        <svg
          className="mx-auto mb-4 h-12 w-12 text-ds-primary/40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
        <h2 className="heading-section text-xl font-bold text-on-surface">
          Нэвтрэх шаардлагатай
        </h2>
        <p className="mt-2 text-sm text-on-surface-variant">
          Хадгалсан боломжуудаа харахын тулд нэвтэрнэ үү.
        </p>
        <Link
          href="/login"
          className="btn-glow mt-6 inline-flex rounded-full bg-gradient-to-r from-ds-primary to-ds-secondary px-6 py-2.5 text-sm font-bold text-on-primary-fixed shadow-lg shadow-ds-primary/20"
        >
          Нэвтрэх
        </Link>
      </div>
    </div>
  );
};
