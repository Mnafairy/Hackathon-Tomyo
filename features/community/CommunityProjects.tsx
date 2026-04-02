import Link from 'next/link';

import type { CommunityProject } from '@/features/community/community-data';

interface CommunityProjectsProps {
  projects: CommunityProject[];
}

export const CommunityProjects = ({ projects }: CommunityProjectsProps) => {
  return (
    <aside className="hidden lg:col-span-3 lg:block">
      {/* Community Projects */}
      <div className="animate-fade-up delay-1 glass-panel rounded-2xl p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">
            Нийгэмлэгийн төслүүд
          </h3>
          <Link
            href="#"
            className="text-xs font-medium text-ds-primary transition-colors hover:text-ds-primary/80"
          >
            Бүгдийг үзэх
          </Link>
        </div>
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.title}
              className="glow-border group relative overflow-hidden rounded-xl"
            >
              <div className={`h-24 bg-gradient-to-br ${project.gradient}`} />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3">
                <h4 className="text-sm font-bold text-white">{project.title}</h4>
                <p className="text-xs text-white/70">
                  {project.contributors} оролцогч
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Stats */}
      <div className="animate-fade-up delay-2 glass-panel mt-6 rounded-2xl p-5">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-on-surface-variant">
          Нийгмийн идэвхи
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-on-surface-variant">Одоо онлайн</span>
            <span className="heading-section text-sm font-bold text-ds-primary">
              1,402
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-on-surface-variant">
              Өнөөдрийн шинэ сэдэв
            </span>
            <span className="heading-section text-sm font-bold text-ds-secondary">
              24
            </span>
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs text-on-surface-variant">Сарын зорилго</span>
              <span className="text-xs font-medium text-ds-tertiary">67%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-container-highest">
              <div
                className="animate-bar-fill h-full rounded-full bg-gradient-to-r from-ds-primary to-ds-tertiary"
                style={{ width: '67%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
