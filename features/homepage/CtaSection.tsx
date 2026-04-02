import Link from 'next/link';

export const CtaSection = () => (
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

      <div className="relative z-10 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
        <Link
          href="/login"
          className="btn-glow w-full rounded-full bg-gradient-to-r from-ds-primary to-ds-secondary px-10 py-4 text-center text-sm font-bold text-on-primary-fixed transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,122,197,0.3)] sm:w-auto"
        >
          Бүртгүүлэх
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
