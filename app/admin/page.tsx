import Link from 'next/link';

import {
  Layers,
  Zap,
  Users,
  Globe,
  ArrowUpRight,
  Briefcase,
  Radio,
  GraduationCap,
  Trophy,
  Sparkles,
} from 'lucide-react';

import { prisma } from '@/lib/prisma';

const typeIcons: Record<string, typeof Trophy> = {
  SCHOLARSHIP: GraduationCap,
  COMPETITION: Trophy,
  INTERNSHIP: Briefcase,
  GRANT: Sparkles,
};

const AdminDashboardPage = async () => {
  const [total, active, expired, users, sources, recentOpps, typeCounts] =
    await Promise.all([
      prisma.opportunity.count(),
      prisma.opportunity.count({ where: { status: 'ACTIVE' } }),
      prisma.opportunity.count({ where: { status: 'EXPIRED' } }),
      prisma.user.count(),
      prisma.scrapedSource.count(),
      prisma.opportunity.findMany({
        orderBy: { scrapedAt: 'desc' },
        take: 6,
        select: {
          id: true,
          title: true,
          type: true,
          status: true,
          scrapedAt: true,
          source: { select: { name: true } },
        },
      }),
      prisma.opportunity.groupBy({
        by: ['type'],
        _count: true,
        where: { status: 'ACTIVE' },
      }),
    ]);

  const stats = [
    {
      label: 'Нийт боломж',
      value: total,
      icon: Layers,
      gradient: 'from-ds-primary/20 to-ds-primary/5',
      iconColor: 'text-ds-primary',
      accent: 'bg-ds-primary',
    },
    {
      label: 'Идэвхтэй',
      value: active,
      icon: Zap,
      gradient: 'from-emerald-500/20 to-emerald-500/5',
      iconColor: 'text-emerald-400',
      accent: 'bg-emerald-500',
    },
    {
      label: 'Хэрэглэгчид',
      value: users,
      icon: Users,
      gradient: 'from-ds-tertiary/20 to-ds-tertiary/5',
      iconColor: 'text-ds-tertiary',
      accent: 'bg-ds-tertiary',
    },
    {
      label: 'Эх сурвалж',
      value: sources,
      icon: Globe,
      gradient: 'from-ds-secondary/20 to-ds-secondary/5',
      iconColor: 'text-ds-secondary',
      accent: 'bg-ds-secondary',
    },
  ];

  const statusColor: Record<string, string> = {
    ACTIVE: 'bg-emerald-500/20 text-emerald-400',
    EXPIRED: 'bg-red-500/20 text-red-400',
    UNKNOWN: 'bg-yellow-500/20 text-yellow-400',
  };

  const typeLabel: Record<string, string> = {
    SCHOLARSHIP: 'Тэтгэлэг',
    COMPETITION: 'Тэмцээн',
    INTERNSHIP: 'Дадлага',
    GRANT: 'Грант',
    JOB: 'Ажил',
    OTHER: 'Бусад',
  };

  const activeRate = total > 0 ? Math.round((active / total) * 100) : 0;
  const expiredRate = total > 0 ? Math.round((expired / total) * 100) : 0;

  return (
    <div>
      {/* Header */}
      <div className="animate-fade-up mb-8">
        <div className="accent-line mb-4" />
        <h1 className="heading-display text-3xl font-bold text-on-background">
          Хянах самбар
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Системийн ерөнхий мэдээлэл
        </p>
      </div>

      {/* Stat Cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`animate-fade-up delay-${i} group relative overflow-hidden rounded-2xl border border-outline-variant/15 bg-gradient-to-br ${stat.gradient} p-5 transition-all duration-300 hover:border-outline-variant/30`}
            >
              <div className={`absolute right-0 top-0 h-16 w-16 rounded-bl-[3rem] ${stat.accent} opacity-[0.07]`} />
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${stat.accent}/10`}>
                <Icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
              <p className="heading-display text-3xl font-bold text-on-surface">
                {stat.value.toLocaleString()}
              </p>
              <p className="mt-1 text-xs font-medium text-on-surface-variant">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Opportunities */}
        <div className="animate-fade-up delay-4 lg:col-span-2">
          <div className="rounded-2xl border border-outline-variant/15 bg-surface-container/50 p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="heading-section text-lg font-bold text-on-surface">
                Сүүлийн боломжууд
              </h2>
              <Link
                href="/admin/opportunities"
                className="flex items-center gap-1 text-xs font-medium text-ds-primary transition-colors hover:text-ds-primary/80"
              >
                Бүгдийг харах
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-1">
              {recentOpps.map((opp) => (
                <div
                  key={opp.id}
                  className="flex items-center gap-4 rounded-xl px-3 py-3 transition-colors hover:bg-surface-container"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-container-high">
                    {(() => {
                      const TypeIcon = typeIcons[opp.type] ?? Briefcase;
                      return (
                        <TypeIcon className="h-4 w-4 text-on-surface-variant" />
                      );
                    })()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-on-surface">
                      {opp.title}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {opp.source.name}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusColor[opp.status] ?? statusColor.UNKNOWN}`}
                  >
                    {opp.status}
                  </span>
                </div>
              ))}
              {recentOpps.length === 0 && (
                <p className="py-8 text-center text-sm text-on-surface-variant">
                  Боломж олдсонгүй
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="animate-fade-up delay-5 space-y-6">
          {/* Health overview */}
          <div className="rounded-2xl border border-outline-variant/15 bg-surface-container/50 p-6">
            <h2 className="heading-section mb-4 text-lg font-bold text-on-surface">
              Статус
            </h2>
            <div className="space-y-4">
              <div>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant">Идэвхтэй</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {activeRate}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-container-high">
                  <div
                    className="animate-bar-fill h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                    style={{ width: `${activeRate}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant">Хугацаа дууссан</span>
                  <span className="font-mono font-bold text-red-400">
                    {expiredRate}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-container-high">
                  <div
                    className="animate-bar-fill h-full rounded-full bg-gradient-to-r from-red-500 to-red-400"
                    style={{ width: `${expiredRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Type breakdown */}
          <div className="rounded-2xl border border-outline-variant/15 bg-surface-container/50 p-6">
            <h2 className="heading-section mb-4 text-lg font-bold text-on-surface">
              Төрлөөр
            </h2>
            <div className="space-y-3">
              {typeCounts.map((tc) => {
                const Icon = typeIcons[tc.type] ?? Briefcase;
                return (
                  <div
                    key={tc.type}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 text-on-surface-variant" />
                      <span className="text-sm text-on-surface-variant">
                        {typeLabel[tc.type] ?? tc.type}
                      </span>
                    </div>
                    <span className="font-mono text-sm font-bold text-on-surface">
                      {tc._count}
                    </span>
                  </div>
                );
              })}
              {typeCounts.length === 0 && (
                <p className="text-sm text-on-surface-variant">Мэдээлэл байхгүй</p>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="rounded-2xl border border-outline-variant/15 bg-surface-container/50 p-6">
            <h2 className="heading-section mb-4 text-lg font-bold text-on-surface">
              Шуурхай
            </h2>
            <div className="space-y-2">
              <Link
                href="/admin/opportunities"
                className="flex items-center gap-3 rounded-xl bg-surface-container px-4 py-3 text-sm font-medium text-on-surface transition-all hover:bg-ds-primary/10 hover:text-ds-primary"
              >
                <Briefcase className="h-4 w-4" />
                Боломжууд удирдах
              </Link>
              <Link
                href="/admin/scraper"
                className="flex items-center gap-3 rounded-xl bg-surface-container px-4 py-3 text-sm font-medium text-on-surface transition-all hover:bg-ds-primary/10 hover:text-ds-primary"
              >
                <Radio className="h-4 w-4" />
                Скрэйпэр шалгах
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
