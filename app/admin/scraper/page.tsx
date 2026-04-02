import { Globe, Clock, Database, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

import { prisma } from '@/lib/prisma';
import { ScrapeButton } from '@/features/admin/ScrapeButton';

const getHealthConfig = (lastScrapedAt: Date | null) => {
  if (!lastScrapedAt) {
    return {
      status: 'error' as const,
      label: 'Хэзээ ч ажлаагүй',
      icon: XCircle,
      dotColor: 'bg-red-500',
      badgeColor: 'bg-red-500/15 text-red-400',
      ringColor: 'ring-red-500/20',
    };
  }
  const hoursAgo = (Date.now() - lastScrapedAt.getTime()) / (1000 * 60 * 60);
  if (hoursAgo < 24) {
    return {
      status: 'healthy' as const,
      label: 'Хэвийн',
      icon: CheckCircle,
      dotColor: 'bg-emerald-500',
      badgeColor: 'bg-emerald-500/15 text-emerald-400',
      ringColor: 'ring-emerald-500/20',
    };
  }
  if (hoursAgo < 48) {
    return {
      status: 'warning' as const,
      label: 'Анхааруулга',
      icon: AlertTriangle,
      dotColor: 'bg-yellow-500',
      badgeColor: 'bg-yellow-500/15 text-yellow-400',
      ringColor: 'ring-yellow-500/20',
    };
  }
  return {
    status: 'error' as const,
    label: 'Алдаатай',
    icon: XCircle,
    dotColor: 'bg-red-500',
    badgeColor: 'bg-red-500/15 text-red-400',
    ringColor: 'ring-red-500/20',
  };
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

const AdminScraperPage = async () => {
  const sources = await prisma.scrapedSource.findMany({
    include: { _count: { select: { opportunities: true } } },
    orderBy: { lastScrapedAt: 'desc' },
  });

  const healthySources = sources.filter(
    (s) => s.lastScrapedAt && (Date.now() - s.lastScrapedAt.getTime()) / (1000 * 60 * 60) < 24,
  ).length;

  return (
    <div>
      {/* Header */}
      <div className="animate-fade-up mb-8 flex items-start justify-between">
        <div>
          <div className="accent-line mb-4" />
          <h1 className="heading-display text-3xl font-bold text-on-background">
            Скрэйпэр мониторинг
          </h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Эх сурвалжуудын төлөв байдал
          </p>
        </div>
        <ScrapeButton />
      </div>

      {/* Overview stats */}
      <div className="animate-fade-up delay-1 mb-8 grid grid-cols-3 gap-4">
        <div className="flex items-center gap-4 rounded-2xl border border-outline-variant/15 bg-surface-container/50 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ds-primary/10">
            <Globe className="h-5 w-5 text-ds-primary" />
          </div>
          <div>
            <p className="heading-display text-2xl font-bold text-on-surface">
              {sources.length}
            </p>
            <p className="text-xs text-on-surface-variant">Нийт сурвалж</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-outline-variant/15 bg-surface-container/50 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <p className="heading-display text-2xl font-bold text-emerald-400">
              {healthySources}
            </p>
            <p className="text-xs text-on-surface-variant">Хэвийн</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-outline-variant/15 bg-surface-container/50 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <p className="heading-display text-2xl font-bold text-red-400">
              {sources.length - healthySources}
            </p>
            <p className="text-xs text-on-surface-variant">Анхааруулга</p>
          </div>
        </div>
      </div>

      {/* Source cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sources.map((source, i) => {
          const health = getHealthConfig(source.lastScrapedAt);
          const HealthIcon = health.icon;
          return (
            <div
              key={source.id}
              className={`animate-fade-up delay-${Math.min(i + 2, 8)} group rounded-2xl border border-outline-variant/15 bg-surface-container/50 p-5 transition-all duration-300 hover:border-outline-variant/30`}
            >
              {/* Header */}
              <div className="mb-4 flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold text-on-surface">
                    {source.name}
                  </h3>
                  <p className="mt-0.5 truncate text-xs text-on-surface-variant/60">
                    {source.url}
                  </p>
                </div>
                <span
                  className={`ml-3 inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${health.badgeColor}`}
                >
                  <HealthIcon className="h-3 w-3" />
                  {health.label}
                </span>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-6 border-t border-outline-variant/10 pt-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-on-surface-variant/50" />
                  <div>
                    <p className="text-[10px] text-on-surface-variant/50">Сүүлд</p>
                    <p className="text-xs font-medium text-on-surface">
                      {formatRelativeTime(source.lastScrapedAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="h-3.5 w-3.5 text-on-surface-variant/50" />
                  <div>
                    <p className="text-[10px] text-on-surface-variant/50">Боломж</p>
                    <p className="font-mono text-xs font-bold text-ds-primary">
                      {source._count.opportunities}
                    </p>
                  </div>
                </div>
              </div>

              {/* Health bar */}
              <div className="mt-4">
                <div className="h-1 overflow-hidden rounded-full bg-surface-container-high">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      health.status === 'healthy'
                        ? 'w-full bg-emerald-500'
                        : health.status === 'warning'
                          ? 'w-2/3 bg-yellow-500'
                          : 'w-1/4 bg-red-500'
                    }`}
                  />
                </div>
              </div>
            </div>
          );
        })}
        {sources.length === 0 && (
          <div className="col-span-full rounded-2xl border border-outline-variant/15 bg-surface-container/50 p-16 text-center text-on-surface-variant">
            Эх сурвалж олдсонгүй
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminScraperPage;
