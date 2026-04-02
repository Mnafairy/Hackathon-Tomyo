'use client';

import { useState } from 'react';

import { Trash2, Loader2 } from 'lucide-react';

import { deleteOpportunity } from '@/actions/opportunities';

interface DeleteButtonProps {
  id: string;
  title: string;
}

export const DeleteButton = ({ id, title }: DeleteButtonProps) => {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await deleteOpportunity(id);
    setLoading(false);
    setConfirming(false);
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="inline-flex h-7 items-center gap-1 rounded-lg bg-red-500/15 px-2.5 text-[11px] font-semibold text-red-400 transition-colors hover:bg-red-500/25 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            'Тийм'
          )}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={loading}
          className="inline-flex h-7 items-center rounded-lg bg-surface-container-high px-2.5 text-[11px] font-medium text-on-surface-variant transition-colors hover:bg-surface-container-highest"
        >
          Үгүй
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      title={`"${title}" устгах`}
      className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-red-500/10 hover:text-red-400"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
};
