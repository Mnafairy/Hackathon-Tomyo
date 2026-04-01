import { prisma } from '@/lib/prisma';

export default async function AdminDashboardPage() {
  const [total, active, users, sources] = await Promise.all([
    prisma.opportunity.count(),
    prisma.opportunity.count({ where: { status: 'ACTIVE' } }),
    prisma.user.count(),
    prisma.scrapedSource.count(),
  ]);

  const stats = [
    { label: 'Нийт боломж', value: total, color: 'text-ds-primary' },
    { label: 'Идэвхтэй', value: active, color: 'text-ds-secondary' },
    { label: 'Хэрэглэгчид', value: users, color: 'text-ds-tertiary' },
    { label: 'Эх сурвалж', value: sources, color: 'text-ds-primary' },
  ];

  return (
    <div className="animate-fade-up">
      <div className="accent-line mb-5" />
      <h1 className="heading-display mb-10 text-3xl font-bold text-on-background">
        Хянах самбар
      </h1>

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`glass-panel animate-fade-up delay-${i} rounded-2xl p-6`}
          >
            <p className="text-sm font-medium text-on-surface-variant">
              {stat.label}
            </p>
            <p className={`heading-display mt-2 text-3xl font-bold ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
