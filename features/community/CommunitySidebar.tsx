import type { Channel } from '@/features/community/community-data';

interface CommunitySidebarProps {
  channels: Channel[];
  trendingTags: string[];
}

export const CommunitySidebar = ({ channels, trendingTags }: CommunitySidebarProps) => {
  return (
    <aside className="hidden lg:col-span-3 lg:block">
      {/* Channels */}
      <div className="animate-fade-up delay-0 glass-panel rounded-2xl p-5">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-on-surface-variant">
          Хэлэлцүүлгийн сувгууд
        </h3>
        <nav className="space-y-1">
          {channels.map((ch) => (
            <button
              key={ch.name}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                ch.active
                  ? 'border-l-2 border-ds-primary bg-gradient-to-r from-ds-primary/10 to-transparent text-ds-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-high/50'
              }`}
            >
              <span className="text-lg">{ch.emoji}</span>
              {ch.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Trending */}
      <div className="animate-fade-up delay-1 glass-panel mt-6 rounded-2xl p-5">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-on-surface-variant">
          Трэнд сэдвүүд
        </h3>
        <div className="flex flex-wrap gap-2">
          {trendingTags.map((tag) => (
            <span
              key={tag}
              className="glow-border rounded-lg bg-surface-container px-3 py-1.5 text-xs font-medium text-ds-secondary"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
};
