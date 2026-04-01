import { prisma } from '@/lib/prisma';

const getHealthStatus = (lastScrapedAt: Date | null) => {
  if (!lastScrapedAt) return { dot: 'bg-red-500', label: 'Хэзээ ч ажлаагүй' };
  const hoursAgo =
    (Date.now() - lastScrapedAt.getTime()) / (1000 * 60 * 60);
  if (hoursAgo < 24) return { dot: 'bg-green-500', label: 'Хэвийн' };
  if (hoursAgo < 48) return { dot: 'bg-yellow-500', label: 'Анхааруулга' };
  return { dot: 'bg-red-500', label: 'Алдаатай' };
};

const formatRelativeTime = (date: Date | null): string => {
  if (!date) return 'Хэзээ ч';
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds} секундын өмнө`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} минутын өмнө`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} цагийн өмнө`;
  const days = Math.floor(hours / 24);
  return `${days} хоногийн өмнө`;
};

export default async function AdminScraperPage() {
  const sources = await prisma.scrapedSource.findMany({
    include: { _count: { select: { opportunities: true } } },
    orderBy: { lastScrapedAt: 'desc' },
  });

  return (
    <div className="animate-fade-up">
      <div className="accent-line mb-5" />
      <h1 className="heading-display mb-10 text-3xl font-bold text-on-background">
        Скрэйпэр мониторинг
      </h1>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {sources.map((source, i) => {
          const health = getHealthStatus(source.lastScrapedAt);
          return (
            <div
              key={source.id}
              className={`glass-panel glow-border animate-fade-up delay-${i} rounded-2xl p-6`}
            >
              <div className="mb-4 flex items-center gap-3">
                <span
                  className={`h-3 w-3 rounded-full ${health.dot} shadow-[0_0_8px_currentColor]`}
                />
                <h3 className="text-lg font-bold text-on-surface">
                  {source.name}
                </h3>
              </div>

              <p className="mb-4 truncate text-sm text-on-surface-variant">
                {source.url}
              </p>

              <div className="flex items-center justify-between border-t border-outline-variant/15 pt-4">
                <div>
                  <p className="text-xs text-on-surface-variant">Сүүлд</p>
                  <p className="text-sm font-medium text-on-surface">
                    {formatRelativeTime(source.lastScrapedAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-on-surface-variant">Боломж</p>
                  <p className="heading-display text-2xl font-bold text-ds-primary">
                    {source._count.opportunities}
                  </p>
                </div>
              </div>

              <div className="mt-3 text-right">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    health.dot === 'bg-green-500'
                      ? 'bg-green-500/20 text-green-400'
                      : health.dot === 'bg-yellow-500'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {health.label}
                </span>
              </div>
            </div>
          );
        })}
        {sources.length === 0 && (
          <div className="glass-panel col-span-full rounded-2xl p-12 text-center text-on-surface-variant">
            Эх сурвалж олдсонгүй
          </div>
        )}
      </div>
    </div>
  );
}
