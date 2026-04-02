import Link from "next/link";

export const HeroSection = () => (
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
        Монголын ахлах, дунд ангийн сурагчдад зориулсан төсөл, тэмцээн,
        хөтөлбөрийн мэдээллийн нэгдсэн платформ.
      </p>

      <div className="animate-fade-up delay-3 mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
        <Link
          href="/discovery"
          className="btn-glow w-full rounded-full bg-gradient-to-r from-ds-primary to-ds-secondary px-10 py-4 text-center text-sm font-bold text-on-primary-fixed transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,122,197,0.3)] sm:w-auto"
        >
          Боломж хайх
        </Link>
        <Link
          href="#features"
          className="glass-panel w-full rounded-full px-10 py-4 text-center text-sm font-semibold text-on-surface transition-all hover:border-ds-primary/50 hover:bg-ds-primary/5 sm:w-auto"
        >
          Дэлгэрэнгүй
        </Link>
      </div>
    </div>
  </section>
);
