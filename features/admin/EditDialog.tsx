'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

import { Pencil, Loader2, X } from 'lucide-react';

import { updateOpportunity } from '@/actions/opportunities';

interface EditDialogProps {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  originalUrl: string;
}

const typeOptions = [
  { value: 'SCHOLARSHIP', label: 'Тэтгэлэг' },
  { value: 'COMPETITION', label: 'Тэмцээн' },
  { value: 'INTERNSHIP', label: 'Дадлага' },
  { value: 'GRANT', label: 'Грант' },
  { value: 'JOB', label: 'Ажил' },
  { value: 'OTHER', label: 'Бусад' },
];

const statusOptions = [
  { value: 'ACTIVE', label: 'Идэвхтэй' },
  { value: 'EXPIRED', label: 'Дууссан' },
  { value: 'UNKNOWN', label: 'Тодорхойгүй' },
];

export const EditDialog = ({
  id,
  title: initialTitle,
  description: initialDesc,
  type: initialType,
  status: initialStatus,
  originalUrl: initialUrl,
}: EditDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDesc);
  const [type, setType] = useState(initialType);
  const [status, setStatus] = useState(initialStatus);
  const [originalUrl, setOriginalUrl] = useState(initialUrl);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Гарчиг хоосон байна');
      return;
    }
    setLoading(true);
    setError('');
    const result = await updateOpportunity(id, {
      title,
      description,
      type,
      status,
      originalUrl,
    });
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setOpen(false);
    }
  };

  const handleOpen = () => {
    setTitle(initialTitle);
    setDescription(initialDesc);
    setType(initialType);
    setStatus(initialStatus);
    setOriginalUrl(initialUrl);
    setError('');
    setOpen(true);
  };

  const modal = open && mounted ? createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={() => setOpen(false)}
      />

      {/* Dialog */}
      <div className="animate-scale-in relative w-full max-w-lg rounded-2xl border border-outline-variant/20 bg-surface-container p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="heading-section text-lg font-bold text-on-surface">
            Боломж засах
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-high"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-on-surface-variant">
              Гарчиг
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-2.5 text-sm text-on-surface outline-none transition-colors focus:border-ds-primary/50 focus:ring-1 focus:ring-ds-primary/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-on-surface-variant">
              Тайлбар
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-2.5 text-sm text-on-surface outline-none transition-colors focus:border-ds-primary/50 focus:ring-1 focus:ring-ds-primary/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-on-surface-variant">
              Вэбсайт холбоос
            </label>
            <input
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="https://"
              className="w-full rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-2.5 text-sm text-on-surface outline-none transition-colors focus:border-ds-primary/50 focus:ring-1 focus:ring-ds-primary/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-on-surface-variant">
                Төрөл
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-2.5 text-sm text-on-surface outline-none transition-colors focus:border-ds-primary/50 focus:ring-1 focus:ring-ds-primary/20"
              >
                {typeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-on-surface-variant">
                Статус
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-2.5 text-sm text-on-surface outline-none transition-colors focus:border-ds-primary/50 focus:ring-1 focus:ring-ds-primary/20"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={() => setOpen(false)}
            disabled={loading}
            className="rounded-xl px-5 py-2.5 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-high"
          >
            Болих
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-ds-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-all hover:brightness-110 disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Хадгалах
          </button>
        </div>
      </div>
    </div>,
    document.body,
  ) : null;

  return (
    <>
      <button
        onClick={handleOpen}
        title="Засах"
        className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-ds-primary/10 hover:text-ds-primary"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>
      {modal}
    </>
  );
};
