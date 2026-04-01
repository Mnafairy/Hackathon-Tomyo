import Link from 'next/link';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Профайл | Lumina Academy',
  description: 'Сурагчийн профайл хуудас',
};

const streakDays = [true, true, true, true, true, true, true];
const interests = ['STEM', 'Программчлал', 'Математик', 'Физик'];

const goals = [
  { label: 'Python', progress: 85 },
  { label: 'Илтгэл', progress: 60 },
  { label: 'Дизайн', progress: 55 },
];

const mentors = [
  { initials: 'ДБ', name: 'Д. Болд', role: 'Математикийн багш' },
  { initials: 'СО', name: 'С. Оюунаа', role: 'STEM зөвлөх' },
  { initials: 'МГ', name: 'М. Ганзориг', role: 'IT ментор' },
];

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Profile Header */}
      <div className="animate-fade-up delay-0 relative">
        <div className="relative h-40 overflow-hidden rounded-2xl bg-gradient-to-r from-ds-primary/30 via-ds-tertiary/20 to-ds-secondary/30">
          <div className="absolute left-10 top-0 h-40 w-40 rounded-full bg-ds-primary/30 blur-3xl" />
          <div className="absolute right-20 top-4 h-32 w-32 rounded-full bg-ds-tertiary/25 blur-3xl" />
        </div>
        <div className="flex items-end justify-between px-2">
          <div className="flex items-end gap-4">
            <div className="-mt-12 ml-8 flex h-24 w-24 items-center justify-center rounded-full border-[3px] border-background bg-gradient-to-br from-ds-primary to-ds-tertiary text-2xl font-bold text-white shadow-xl shadow-ds-primary/20">
              БТ
            </div>
            <div className="pb-2">
              <h1 className="heading-display text-2xl">Б. Тэмүүлэн</h1>
              <p className="text-sm text-on-surface-variant/70">
                12-р ангийн сурагч &bull; Шинжлэх ухааны чиглэл
              </p>
            </div>
          </div>
          <div className="flex gap-2 pb-2">
            <button className="btn-glow rounded-full bg-gradient-to-r from-ds-primary to-ds-secondary px-5 py-2 text-sm font-medium text-white transition-all hover:opacity-90">
              Профайл засах
            </button>
            <button className="glass-panel rounded-full px-4 py-2 text-sm text-on-surface transition-colors hover:border-ds-primary/50">
              Хуваалцах
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Curator Stats */}
        <div className="animate-fade-up delay-1 glass-panel glow-border rounded-2xl p-6">
          <h3 className="mb-4 text-sm font-semibold text-on-surface-variant">
            Curator Stats
          </h3>
          <div className="flex justify-between text-center">
            <div>
              <p className="stat-value heading-section text-3xl">1.2k</p>
              <p className="mt-1 text-xs text-on-surface-variant">Нөөц</p>
            </div>
            <div>
              <p className="stat-value heading-section text-3xl">48</p>
              <p className="mt-1 text-xs text-on-surface-variant">Цуглуулга</p>
            </div>
            <div>
              <p className="stat-value heading-section text-3xl">12.5k</p>
              <p className="mt-1 text-xs text-on-surface-variant">Хүрэлт</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="rounded-full border border-ds-primary/20 bg-gradient-to-r from-ds-primary/15 to-ds-secondary/15 px-3 py-1 text-xs font-medium text-ds-primary">
              Шилдэг 5% Идэвхтэн
            </span>
            <span className="text-sm font-semibold text-ds-tertiary">
              Level 43
            </span>
          </div>
        </div>

        {/* Streak */}
        <div className="animate-fade-up delay-2 glow-border rounded-2xl border border-ds-primary/15 bg-gradient-to-br from-ds-primary/8 to-ds-secondary/8 p-6">
          <h3 className="mb-3 text-sm font-semibold text-on-surface-variant">
            Streak
          </h3>
          <p className="heading-display text-gradient-primary text-4xl">124</p>
          <p className="mt-1 text-sm text-on-surface-variant">
            Тасралтгүй суралцсан өдөр
          </p>
          <div className="mt-4 flex gap-1.5">
            {streakDays.map((active, i) => (
              <div
                key={i}
                className={`h-4 w-full rounded-md ${active ? 'bg-gradient-to-t from-ds-primary to-ds-secondary' : 'bg-surface-container-highest'}`}
              />
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="animate-fade-up delay-3 glass-panel glow-border rounded-2xl p-6">
          <h3 className="mb-4 text-sm font-semibold text-on-surface-variant">
            Interests
          </h3>
          <div className="flex flex-wrap gap-2">
            {interests.map((tag) => (
              <span
                key={tag}
                className="rounded-lg bg-surface-container-highest/80 px-3 py-1.5 text-xs font-medium text-on-surface/90"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-2">
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-container-highest">
              <div className="animate-bar-fill h-full w-[88%] rounded-full bg-gradient-to-r from-ds-secondary to-ds-primary" />
            </div>
            <span className="text-sm font-semibold text-ds-secondary">88%</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-8 lg:col-span-2">
          {/* Curated Section */}
          <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="heading-section accent-line text-lg">
                Танд зориулсан
              </h2>
              <Link
                href="#"
                className="text-sm text-ds-primary hover:underline"
              >
                Бүгдийг үзэх
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="animate-fade-up delay-4 glass-card glow-border rounded-2xl p-6">
                <div className="mb-3 flex gap-2">
                  <span className="rounded-full bg-gradient-to-r from-ds-error to-ds-primary px-2.5 py-0.5 text-xs font-semibold text-white">
                    ШИНЭ
                  </span>
                  <span className="rounded-full bg-surface-container-highest px-2.5 py-0.5 text-xs font-medium text-on-surface-variant">
                    Тэмцээн
                  </span>
                </div>
                <h3 className="font-semibold text-on-surface">
                  Математикийн олимпиадын бэлтгэл
                </h3>
                <p className="mt-1.5 text-sm text-on-surface-variant">
                  12 цаг &bull; Дунд түвшин
                </p>
              </div>
              <div className="animate-fade-up delay-5 glass-card glow-border rounded-2xl p-6">
                <div className="mb-3">
                  <span className="rounded-full bg-surface-container-highest px-2.5 py-0.5 text-xs font-medium text-on-surface-variant">
                    Хөтөлбөр
                  </span>
                </div>
                <h3 className="font-semibold text-on-surface">
                  AI-ийн үндэс: Програмчлалын сургалт
                </h3>
                <p className="mt-1.5 text-sm text-on-surface-variant">
                  8 цаг &bull; Анхан шат
                </p>
              </div>
            </div>
          </section>

          {/* Activity Timeline */}
          <section className="animate-fade-up delay-6">
            <h2 className="heading-section accent-line mb-5 text-lg">
              Сүүлийн үйл ажиллагаа
            </h2>
            <div className="space-y-0 border-l-2 border-ds-primary/30 pl-6">
              <div className="relative pb-6">
                <div className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full bg-gradient-to-br from-ds-primary to-ds-secondary ring-4 ring-background" />
                <p className="font-medium text-on-surface">
                  Математикийн олимпиадын бэлтгэл цуглуулга нэмсэн
                </p>
                <p className="text-sm text-on-surface-variant">
                  2 цагийн өмнө
                </p>
              </div>
              <div className="relative pb-2">
                <div className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full bg-gradient-to-br from-ds-secondary to-ds-tertiary ring-4 ring-background" />
                <p className="font-medium text-on-surface">
                  STEM шилдэг 50 тэмдэг авсан
                </p>
                <p className="text-sm text-on-surface-variant">Өчигдөр</p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Goals */}
          <div className="glass-panel glow-border rounded-2xl p-6">
            <h3 className="mb-4 font-semibold text-on-background">
              Идэвхтэй зорилтууд
            </h3>
            <div className="space-y-4">
              {goals.map((goal, i) => (
                <div key={goal.label}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-medium text-on-surface">
                      {goal.label}
                    </span>
                    <span className="text-on-surface-variant">
                      {goal.progress}%
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-surface-container-highest">
                    <div
                      className={`animate-bar-fill h-full rounded-full bg-gradient-to-r from-ds-primary to-ds-tertiary delay-${i + 4}`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mentors */}
          <div className="glass-panel glow-border rounded-2xl p-6">
            <h3 className="mb-4 font-semibold text-on-background">
              Шилдэг зөвлөхүүд
            </h3>
            <div className="space-y-3">
              {mentors.map((m) => (
                <div key={m.name} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-ds-tertiary/20 to-ds-primary/20 text-sm font-semibold text-ds-tertiary">
                    {m.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-on-surface">
                      {m.name}
                    </p>
                    <p className="text-xs text-on-surface-variant">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Challenge */}
          <div className="rounded-2xl border border-ds-primary/15 bg-gradient-to-br from-ds-primary/10 via-ds-secondary/5 to-ds-tertiary/10 p-6">
            <h3 className="font-semibold text-on-background">Өдрийн сорилт</h3>
            <p className="mt-2 text-sm text-on-surface-variant">
              CSS Grid-ийн 12 баганат загварыг ойлгох
            </p>
            <button className="btn-glow mt-4 rounded-full bg-gradient-to-r from-ds-primary to-ds-secondary px-5 py-2 text-sm font-medium text-white transition-all hover:opacity-90">
              Сорилт эхлүүлэх
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
