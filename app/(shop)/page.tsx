import Link from 'next/link';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lumina Academy | Боломжуудын нээлт',
  description:
    'Монголын ахлах ангийн сурагчдад зориулсан төсөл, тэмцээн, амжилтын боломжуудын платформ',
};

const features = [
  {
    title: 'Боломж олох',
    description:
      'AI-д суурилсан ухаалаг систем таны сонирхол, чадварт тохирсон боломжуудыг санал болгоно.',
    span: 'md:col-span-8',
    gradient: 'from-ds-primary/60 to-ds-secondary/60',
  },
  {
    title: 'Нийгэмлэг',
    description: 'Ижил зорилготой сурагчидтай холбогдож, хамтдаа хөгжи.',
    span: 'md:col-span-4',
    gradient: 'from-ds-tertiary/60 to-ds-primary/60',
  },
  {
    title: 'Ур чадвар',
    description:
      'Өөрийн ур чадварын хөгжлийг хянаж, дараагийн алхамаа төлөвлө.',
    span: 'md:col-span-4',
    gradient: 'from-ds-secondary/60 to-ds-tertiary/60',
  },
  {
    title: 'Хувийн зөвлөгөө',
    description:
      'Таны профайл дээр суурилсан хувийн зөвлөмж, зөвлөгөөг хүлээн авна уу.',
    span: 'md:col-span-8',
    gradient: 'from-ds-primary/60 to-ds-tertiary/60',
  },
];

const stats = [
  { value: '500+', label: 'Сурагчид' },
  { value: '120+', label: 'Боломжууд' },
  { value: '94%', label: 'Амжилт' },
  { value: '15+', label: 'Хичээл' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative flex h-[800px] items-center justify-center overflow-hidden bg-background">
        {/* Nebula orbs */}
        <div className="nebula-orb animate-float-slow absolute -left-40 top-20 h-[500px] w-[500px] bg-ds-primary/20" />
        <div className="nebula-orb animate-float-slow absolute right-[-100px] top-40 h-[400px] w-[400px] bg-ds-tertiary/15" />
        <div className="nebula-orb animate-float-slow absolute bottom-20 left-1/3 h-[300px] w-[300px] bg-ds-secondary/10" />

        {/* Noise texture */}
        <div className="noise-overlay absolute inset-0" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <span className="animate-fade-up delay-0 mb-6 inline-flex items-center gap-2 rounded-full border border-ds-primary/30 bg-ds-primary/10 px-5 py-2 text-sm font-medium text-ds-primary backdrop-blur-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-ds-primary animate-pulse-glow" />
            Боломжуудын Платформ
          </span>

          <h1 className="heading-display animate-fade-up delay-1 mt-6 text-6xl font-black leading-[0.95] tracking-tight md:text-8xl">
            <span className="text-on-background">Ирээдүйгээ</span>
            <br />
            <span className="text-gradient-primary">өөрөө бүтээ.</span>
          </h1>

          <p className="animate-fade-up delay-2 mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-on-surface-variant/80 md:text-xl">
            Монголын ахлах ангийн сурагчдад зориулсан төсөл, тэмцээн,
            хөтөлбөрийн мэдээллийн нэгдсэн платформ.
          </p>

          <div className="animate-fade-up delay-3 mt-12 flex items-center justify-center gap-5">
            <Link
              href="/discovery"
              className="btn-glow rounded-full bg-gradient-to-r from-ds-primary to-ds-secondary px-10 py-4 text-sm font-bold text-on-primary-fixed transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,122,197,0.3)]"
            >
              Боломж хайх
            </Link>
            <Link
              href="#features"
              className="glass-panel rounded-full px-10 py-4 text-sm font-semibold text-on-surface transition-all hover:border-ds-primary/50 hover:bg-ds-primary/5"
            >
              Дэлгэрэнгүй
            </Link>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-28">
        <div className="mb-14">
          <div className="accent-line mb-5" />
          <h2 className="heading-section text-4xl font-bold text-on-background md:text-5xl">
            Ухаалаг Нээлт
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`${feature.span} glow-border animate-fade-up delay-${i} group relative overflow-hidden rounded-2xl bg-surface-container p-8 transition-all duration-300 hover:translate-y-[-2px] md:p-10`}
            >
              {/* Decorative gradient orb */}
              {i === 0 && (
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-ds-primary/8 blur-3xl" />
              )}
              {i === 3 && (
                <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-ds-tertiary/8 blur-3xl" />
              )}

              {/* Abstract shape icon */}
              <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient}`}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-on-primary-fixed"
                >
                  {i === 0 && (
                    <circle cx="12" cy="12" r="8" fill="currentColor" opacity="0.9" />
                  )}
                  {i === 1 && (
                    <>
                      <circle cx="8" cy="12" r="4" fill="currentColor" opacity="0.7" />
                      <circle cx="16" cy="12" r="4" fill="currentColor" opacity="0.9" />
                    </>
                  )}
                  {i === 2 && (
                    <polygon points="12,2 22,22 2,22" fill="currentColor" opacity="0.9" />
                  )}
                  {i === 3 && (
                    <rect x="4" y="4" width="16" height="16" rx="4" fill="currentColor" opacity="0.9" />
                  )}
                </svg>
              </div>

              <h3 className="text-xl font-bold text-on-surface md:text-2xl">
                {feature.title}
              </h3>
              <p className="mt-3 leading-relaxed text-on-surface-variant/80">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative border-y border-outline-variant/10 bg-surface-container-low py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(125,147,255,0.05)_0%,transparent_70%)]" />
        <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-10 px-6 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`animate-fade-up delay-${i} text-center`}
            >
              <p className="stat-value heading-display text-5xl font-black md:text-6xl">
                {stat.value}
              </p>
              <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-on-surface-variant">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-6xl px-6 py-28">
        <div className="glass-panel relative overflow-hidden rounded-3xl p-14 text-center md:p-20">
          {/* Top gradient line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ds-primary to-transparent" />

          {/* Floating orb decorations */}
          <div className="absolute right-10 top-10 h-32 w-32 rounded-full bg-ds-primary/5 blur-2xl" />
          <div className="absolute bottom-10 left-10 h-24 w-24 rounded-full bg-ds-tertiary/5 blur-2xl" />
          <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ds-secondary/5 blur-3xl" />

          <h2 className="heading-display relative z-10 text-4xl font-bold text-on-background md:text-5xl">
            Боломжоо олоход
            <br />
            <span className="text-gradient-primary">бэлэн үү?</span>
          </h2>

          <p className="relative z-10 mx-auto mt-6 max-w-md text-lg text-on-surface-variant/80">
            Платформд нэгдэж, өөрийн ирээдүйг бүтээх анхны алхамаа хий.
          </p>

          <div className="relative z-10 mt-10 flex items-center justify-center gap-5">
            <Link
              href="/login"
              className="btn-glow rounded-full bg-gradient-to-r from-ds-primary to-ds-secondary px-10 py-4 text-sm font-bold text-on-primary-fixed transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,122,197,0.3)]"
            >
              Бүртгүүлэх
            </Link>
            <Link
              href="#features"
              className="glass-panel rounded-full px-10 py-4 text-sm font-semibold text-on-surface transition-all hover:border-ds-primary/50 hover:bg-ds-primary/5"
            >
              Дэлгэрэнгүй
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
