import Link from 'next/link';

import {
  GraduationCap,
  Trophy,
  Briefcase,
  Sparkles,
  Zap,
  Clock,
  ExternalLink,
  Layers,
} from 'lucide-react';

import { prisma } from '@/lib/prisma';
import { DeleteButton } from '@/features/admin/DeleteButton';
import { EditDialog } from '@/features/admin/EditDialog';

const typeConfig: Record<string, { label: string; icon: typeof Trophy; color: string }> = {
  SCHOLARSHIP: { label: 'Тэтгэлэг', icon: GraduationCap, color: 'bg-purple-500/15 text-purple-400' },
  COMPETITION: { label: 'Тэмцээн', icon: Trophy, color: 'bg-amber-500/15 text-amber-400' },
  INTERNSHIP: { label: 'Дадлага', icon: Briefcase, color: 'bg-blue-500/15 text-blue-400' },
  GRANT: { label: 'Грант', icon: Sparkles, color: 'bg-emerald-500/15 text-emerald-400' },
  JOB: { label: 'Ажил', icon: Briefcase, color: 'bg-cyan-500/15 text-cyan-400' },
  OTHER: { label: 'Бусад', icon: Layers, color: 'bg-gray-500/15 text-gray-400' },
};

const statusConfig: Record<string, { label: string; icon: typeof Zap; color: string; dot: string }> = {
  ACTIVE: { label: 'Идэвхтэй', icon: Zap, color: 'bg-emerald-500/15 text-emerald-400', dot: 'bg-emerald-500' },
  EXPIRED: { label: 'Дууссан', icon: Clock, color: 'bg-red-500/15 text-red-400', dot: 'bg-red-500' },
  UNKNOWN: { label: 'Тодорхойгүй', icon: Clock, color: 'bg-yellow-500/15 text-yellow-400', dot: 'bg-yellow-500' },
};

const AdminOpportunitiesPage = async () => {
  const [opportunities, totalActive, totalExpired] = await Promise.all([
    prisma.opportunity.findMany({
      include: { source: { select: { name: true } } },
      orderBy: { scrapedAt: 'desc' },
    }),
    prisma.opportunity.count({ where: { status: 'ACTIVE' } }),
    prisma.opportunity.count({ where: { status: 'EXPIRED' } }),
  ]);

  return (
    <div>
      {/* Header */}
      <div className="animate-fade-up mb-8">
        <div className="accent-line mb-4" />
        <h1 className="heading-display text-3xl font-bold text-on-background">
          Боломжуудын удирдлага
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Нийт {opportunities.length} боломж бүртгэгдсэн
        </p>
      </div>

      {/* Quick stats */}
      <div className="animate-fade-up delay-1 mb-6 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-full border border-outline-variant/15 bg-surface-container/60 px-4 py-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-medium text-on-surface-variant">
            Идэвхтэй: <span className="font-mono font-bold text-emerald-400">{totalActive}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-outline-variant/15 bg-surface-container/60 px-4 py-2">
          <div className="h-2 w-2 rounded-full bg-red-500" />
          <span className="text-xs font-medium text-on-surface-variant">
            Дууссан: <span className="font-mono font-bold text-red-400">{totalExpired}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-outline-variant/15 bg-surface-container/60 px-4 py-2">
          <Layers className="h-3 w-3 text-on-surface-variant" />
          <span className="text-xs font-medium text-on-surface-variant">
            Нийт: <span className="font-mono font-bold text-on-surface">{opportunities.length}</span>
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="animate-fade-up delay-2 overflow-hidden rounded-2xl border border-outline-variant/15 bg-surface-container/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-outline-variant/15">
                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant/70">
                  Гарчиг
                </th>
                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant/70">
                  Төрөл
                </th>
                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant/70">
                  Статус
                </th>
                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant/70">
                  Эх сурвалж
                </th>
                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant/70">
                  Огноо
                </th>
                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant/70">
                  Үйлдэл
                </th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map((opp, i) => {
                const tc = typeConfig[opp.type] ?? typeConfig.OTHER;
                const sc = statusConfig[opp.status] ?? statusConfig.UNKNOWN;
                const TypeIcon = tc.icon;
                return (
                  <tr
                    key={opp.id}
                    className={`animate-fade-up delay-${Math.min(i, 8)} border-b border-outline-variant/8 transition-colors hover:bg-surface-container`}
                  >
                    <td className="max-w-xs px-5 py-3.5">
                      <p className="truncate font-medium text-on-surface">
                        {opp.title}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${tc.color}`}
                      >
                        <TypeIcon className="h-3 w-3" />
                        {tc.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${sc.color}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-on-surface-variant">
                      {opp.source.name}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-on-surface-variant">
                      {opp.scrapedAt.toLocaleDateString('mn-MN')}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <EditDialog
                          id={opp.id}
                          title={opp.title}
                          description={opp.description}
                          type={opp.type}
                          status={opp.status}
                          originalUrl={opp.originalUrl}
                        />
                        <Link
                          href={opp.originalUrl}
                          target="_blank"
                          className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-ds-primary/10 hover:text-ds-primary"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                        <DeleteButton id={opp.id} title={opp.title} />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {opportunities.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-16 text-center text-on-surface-variant"
                  >
                    Боломж олдсонгүй
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOpportunitiesPage;
