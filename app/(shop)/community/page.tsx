import type { Metadata } from 'next';

import {
  channels,
  projects,
  threadDelays,
  threads,
  trendingTags,
} from '@/features/community/community-data';
import { CommunitySidebar } from '@/features/community/CommunitySidebar';
import { CommunityProjects } from '@/features/community/CommunityProjects';
import { ThreadCard } from '@/features/community/ThreadCard';

export const metadata: Metadata = {
  title: 'Нийгэмлэг | Peony',
  description:
    'Монголын ахлах ангийн сурагчдын нийгэмлэг — хэлэлцүүлэг, төсөл, хамтын ажиллагаа',
};

const CommunityPage = () => {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Page Heading */}
      <div className="animate-fade-up mb-10">
        <h1 className="heading-section text-3xl font-bold tracking-tight text-on-surface">
          Нийгэмлэг
        </h1>
        <div className="accent-line mt-3" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <CommunitySidebar channels={channels} trendingTags={trendingTags} />

        {/* Center Column */}
        <div className="lg:col-span-6">
          {/* Search + Filter */}
          <div className="animate-fade-up delay-0 glass-panel mb-6 flex items-center gap-3 rounded-2xl p-3">
            <div className="flex flex-1 items-center gap-2 rounded-xl bg-surface-container-high px-4 py-2.5">
              <svg
                className="h-4 w-4 text-on-surface-variant"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span className="text-sm text-on-surface-variant">
                Хэлэлцүүлэг хайх...
              </span>
            </div>
            <button className="rounded-xl bg-surface-container-high px-4 py-2.5 text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface">
              Шүүлт
            </button>
          </div>

          {/* Threads */}
          <div className="space-y-4">
            {threads.map((thread, idx) => (
              <ThreadCard
                key={thread.id}
                thread={thread}
                delay={threadDelays[idx] ?? ''}
              />
            ))}
          </div>
        </div>

        <CommunityProjects projects={projects} />
      </div>
    </div>
  );
};

export default CommunityPage;
