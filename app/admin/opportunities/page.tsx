import { prisma } from '@/lib/prisma';

const statusColor: Record<string, string> = {
  ACTIVE: 'bg-green-500/20 text-green-400',
  EXPIRED: 'bg-red-500/20 text-red-400',
  UNKNOWN: 'bg-gray-500/20 text-gray-400',
};

export default async function AdminOpportunitiesPage() {
  const opportunities = await prisma.opportunity.findMany({
    include: { source: { select: { name: true } } },
    orderBy: { scrapedAt: 'desc' },
  });

  return (
    <div className="animate-fade-up">
      <div className="accent-line mb-5" />
      <h1 className="heading-display mb-10 text-3xl font-bold text-on-background">
        Боломжуудын удирдлага
      </h1>

      <div className="glass-panel overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-outline-variant/20 text-on-surface-variant">
                <th className="px-6 py-4 font-medium">Гарчиг</th>
                <th className="px-6 py-4 font-medium">Төрөл</th>
                <th className="px-6 py-4 font-medium">Статус</th>
                <th className="px-6 py-4 font-medium">Эх сурвалж</th>
                <th className="px-6 py-4 font-medium">Огноо</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map((opp) => (
                <tr
                  key={opp.id}
                  className="border-b border-outline-variant/10 transition-colors hover:bg-ds-primary/5"
                >
                  <td className="max-w-xs truncate px-6 py-4 font-medium text-on-surface">
                    {opp.title}
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-ds-tertiary/20 px-3 py-1 text-xs font-medium text-ds-tertiary">
                      {opp.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor[opp.status] ?? statusColor.UNKNOWN}`}
                    >
                      {opp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant">
                    {opp.source.name}
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant">
                    {opp.scrapedAt.toLocaleDateString('mn-MN')}
                  </td>
                </tr>
              ))}
              {opportunities.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-on-surface-variant"
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
}
