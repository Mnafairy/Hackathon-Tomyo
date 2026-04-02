'use client';

import { useState } from 'react';

import { Play, Loader2, CheckCircle, XCircle } from 'lucide-react';

import { runScrapeNow } from '@/actions/scraper';

interface ScrapeResult {
  success: boolean;
  scraped: number;
  classified: number;
  saved: number;
  error?: string;
  errors: string[];
}

export const ScrapeButton = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScrapeResult | null>(null);

  const handleScrape = async () => {
    setLoading(true);
    setResult(null);
    const res = await runScrapeNow();
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleScrape}
        disabled={loading}
        className="inline-flex items-center gap-2.5 rounded-xl bg-ds-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-all hover:brightness-110 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Скрэйп хийж байна...
          </>
        ) : (
          <>
            <Play className="h-4 w-4" />
            Одоо скрэйп хийх
          </>
        )}
      </button>

      {result && (
        <div
          className={`rounded-xl border p-4 ${
            result.success
              ? 'border-emerald-500/20 bg-emerald-500/10'
              : 'border-red-500/20 bg-red-500/10'
          }`}
        >
          <div className="flex items-center gap-2">
            {result.success ? (
              <CheckCircle className="h-4 w-4 text-emerald-400" />
            ) : (
              <XCircle className="h-4 w-4 text-red-400" />
            )}
            <span
              className={`text-sm font-semibold ${
                result.success ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {result.success ? 'Амжилттай' : 'Алдаа гарлаа'}
            </span>
          </div>

          {result.success ? (
            <div className="mt-2 flex flex-wrap gap-4 text-xs text-on-surface-variant">
              <span>
                Скрэйп: <span className="font-mono font-bold text-on-surface">{result.scraped}</span>
              </span>
              <span>
                Ангилсан: <span className="font-mono font-bold text-on-surface">{result.classified}</span>
              </span>
              <span>
                Хадгалсан: <span className="font-mono font-bold text-emerald-400">{result.saved}</span>
              </span>
            </div>
          ) : (
            <p className="mt-1 text-xs text-red-400">{result.error}</p>
          )}

          {result.errors.length > 0 && (
            <div className="mt-2 space-y-1">
              {result.errors.map((err, i) => (
                <p key={i} className="text-xs text-on-surface-variant">
                  {err}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
