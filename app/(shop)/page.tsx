import type { Metadata } from "next";

import { HeroSection } from "@/features/homepage/HeroSection";
import { CtaSection } from "@/features/homepage/CtaSection";
import { features } from "@/features/homepage/homepage-data";

export const metadata: Metadata = {
  title: "Peony | Боломжуудын нээлт",
  description:
    "Монголын ахлах, дунд ангийн сурагчдад зориулсан төсөл, тэмцээн, амжилтын боломжуудын платформ",
};

const HomePage = () => (
  <>
    <HeroSection />

    {/* Features Bento Grid */}
    <section id="features" className="mx-auto max-w-6xl px-6 py-28">
      <div className="mb-14">
        <div className="accent-line mb-5" />
        <h2 className="heading-section text-4xl font-bold text-on-background md:text-5xl">
          Юу олох вэ?
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
            <div
              className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient}`}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="text-on-primary-fixed"
              >
                {i === 0 && (
                  <circle
                    cx="12"
                    cy="12"
                    r="8"
                    fill="currentColor"
                    opacity="0.9"
                  />
                )}
                {i === 1 && (
                  <>
                    <circle
                      cx="8"
                      cy="12"
                      r="4"
                      fill="currentColor"
                      opacity="0.7"
                    />
                    <circle
                      cx="16"
                      cy="12"
                      r="4"
                      fill="currentColor"
                      opacity="0.9"
                    />
                  </>
                )}
                {i === 2 && (
                  <polygon
                    points="12,2 22,22 2,22"
                    fill="currentColor"
                    opacity="0.9"
                  />
                )}
                {i === 3 && (
                  <rect
                    x="4"
                    y="4"
                    width="16"
                    height="16"
                    rx="4"
                    fill="currentColor"
                    opacity="0.9"
                  />
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

    <CtaSection />
  </>
);

export default HomePage;
