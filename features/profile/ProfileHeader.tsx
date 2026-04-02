interface ProfileHeaderProps {
  initial: string;
  displayName: string;
  email: string;
  joinDate: string;
}

export const ProfileHeader = ({ initial, displayName, email, joinDate }: ProfileHeaderProps) => {
  return (
    <section className="animate-fade-up delay-0">
      <div className="relative overflow-hidden rounded-2xl">
        {/* Banner */}
        <div className="h-36 bg-gradient-to-r from-ds-primary/25 via-ds-tertiary/15 to-ds-secondary/25 md:h-44">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(125,147,255,0.12)_0%,transparent_60%)]" />
        </div>

        {/* Avatar + Info row */}
        <div className="relative -mt-14 px-6 pb-6 md:px-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-background bg-gradient-to-br from-ds-primary to-ds-tertiary text-3xl font-black text-white shadow-xl shadow-ds-primary/20">
                {initial}
              </div>
              <div className="pb-1">
                <h1 className="heading-display text-2xl font-bold tracking-tight md:text-3xl">
                  {displayName}
                </h1>
                <p className="mt-0.5 text-sm text-on-surface-variant">
                  {email}
                </p>
                <p className="mt-0.5 text-xs text-on-surface-variant/60">
                  {joinDate}-с хойш нэгдсэн
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
