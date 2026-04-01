'use client';

import { useState } from 'react';

interface BookmarkButtonProps {
  opportunityId: string;
  initialSaved: boolean;
}

export const BookmarkButton = ({
  opportunityId,
  initialSaved,
}: BookmarkButtonProps) => {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/opportunities/${opportunityId}/bookmark`,
        { method: 'POST' },
      );
      if (res.ok) {
        setSaved(!saved);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="text-on-surface-variant transition-colors hover:text-ds-primary disabled:opacity-50"
      aria-label={saved ? 'Хадгалсан' : 'Хадгалах'}
    >
      <svg
        className="h-5 w-5"
        fill={saved ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
    </button>
  );
};
