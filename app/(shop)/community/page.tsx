import Link from 'next/link';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Нийгэмлэг | Lumina Academy',
  description:
    'Монголын ахлах ангийн сурагчдын нийгэмлэг — хэлэлцүүлэг, төсөл, хамтын ажиллагаа',
};

const channels = [
  { emoji: '💬', name: 'Ерөнхий', active: true },
  { emoji: '📐', name: 'Математик', active: false },
  { emoji: '🔬', name: 'Шинжлэх ухаан', active: false },
  { emoji: '💻', name: 'Технологи', active: false },
];

const trendingTags = ['#олимпиад', '#хакатон', '#STEM', '#тэтгэлэг'];

const threads = [
  {
    id: 1,
    author: 'Б. Тэмүүлэн',
    time: '2 цагийн өмнө',
    category: 'Ерөнхий',
    votes: 142,
    title:
      'Олимпиадын бэлтгэл хэрхэн эхлэх вэ? Туршлагатай хүмүүсээс зөвлөгөө авмаар байна',
    preview:
      'Сайн байна уу! Би 10-р ангийн сурагч бөгөөд энэ жил анх удаа олимпиадад оролцохоор бэлдэж байна. Ямар номноос эхлэх, хэрхэн цагаа зөв хуваарилах талаар зөвлөгөө өгөөч.',
    comments: 48,
    pinned: false,
    attachment: null,
    highlighted: false,
  },
  {
    id: 2,
    author: 'А. Сарнай',
    time: '5 цагийн өмнө',
    category: 'Математик',
    votes: 89,
    title: 'Математикийн олимпиадын бэлтгэл материалуудыг хуваалцъя',
    preview:
      'Математикийн олимпиадад бэлдэж буй сурагчдад зориулж миний цуглуулсан материалуудыг хуваалцаж байна.',
    comments: 12,
    pinned: false,
    attachment: { name: 'Олимпиад_бэлтгэл.pdf', size: '2.4 MB' },
    highlighted: true,
  },
  {
    id: 3,
    author: 'Модератор',
    time: '1 өдрийн өмнө',
    category: 'Ерөнхий',
    votes: 215,
    title: 'Улирлын хакатон: Бүртгэл нээгдлээ!',
    preview:
      'Энэ улирлын хакатон ирэх сарын 15-нд эхлэх бөгөөд бүх ахлах ангийн сурагчдад нээлттэй. Багаараа эсвэл ганцаараа бүртгүүлээрэй!',
    comments: 67,
    pinned: true,
    attachment: null,
    highlighted: false,
  },
];

const projects = [
  {
    title: 'EcoMongolia Апп',
    contributors: 12,
    gradient: 'from-ds-primary/60 to-ds-tertiary/40',
  },
  {
    title: 'MathBattle Тэмцээн',
    contributors: 8,
    gradient: 'from-ds-secondary/60 to-ds-primary/40',
  },
];

const threadDelays = ['delay-1', 'delay-2', 'delay-3'];

export default function CommunityPage() {
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
        {/* Left Sidebar */}
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
              <article
                key={thread.id}
                className={`animate-fade-up ${threadDelays[idx] ?? ''} glass-card glow-border rounded-2xl p-5 ${
                  thread.highlighted
                    ? 'border-l-[3px] border-l-ds-tertiary'
                    : ''
                } ${thread.pinned ? 'opacity-80 transition-opacity hover:opacity-100' : ''}`}
              >
                {/* Pinned Badge */}
                {thread.pinned && (
                  <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-ds-tertiary/20 bg-gradient-to-r from-ds-tertiary/20 to-ds-primary/20 px-3 py-1 text-xs font-medium text-on-tertiary-container">
                    <svg
                      className="h-3 w-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15z" />
                    </svg>
                    Модераторууд бэхэлсэн
                  </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-ds-primary/30 to-ds-tertiary/30 text-xs font-bold text-on-surface">
                      {thread.author.charAt(0)}
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-on-surface">
                        {thread.author}
                      </span>
                      <span className="ml-2 text-xs text-on-surface-variant">
                        {thread.time}
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full bg-surface-container-high px-2.5 py-0.5 text-xs font-medium text-ds-secondary">
                    {thread.category}
                  </span>
                </div>

                {/* Votes + Content */}
                <div className="mt-3 flex gap-4">
                  {/* Vote Column */}
                  <div className="flex flex-col items-center gap-1 pt-1">
                    <button className="text-on-surface-variant transition-colors hover:text-ds-primary">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    </button>
                    <span className="heading-section text-sm font-bold text-ds-primary">
                      {thread.votes}
                    </span>
                    <button className="text-on-surface-variant transition-colors hover:text-ds-tertiary">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="heading-section text-base font-bold leading-snug text-on-surface">
                      {thread.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                      {thread.preview}
                    </p>

                    {/* Attachment */}
                    {thread.attachment && (
                      <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-outline-variant/20 bg-surface-container px-3 py-2 text-xs">
                        <svg
                          className="h-4 w-4 text-ds-tertiary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                          />
                        </svg>
                        <span className="font-medium text-on-surface">
                          {thread.attachment.name}
                        </span>
                        <span className="text-on-surface-variant">
                          {thread.attachment.size}
                        </span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-4 flex items-center gap-5 text-xs text-on-surface-variant">
                      <button className="flex items-center gap-1.5 transition-colors hover:text-ds-primary">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        {thread.comments} Сэтгэгдэл
                      </button>
                      <button className="flex items-center gap-1.5 transition-colors hover:text-ds-primary">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                          />
                        </svg>
                        Хуваалцах
                      </button>
                      {!thread.pinned && (
                        <button className="flex items-center gap-1.5 transition-colors hover:text-ds-primary">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                            />
                          </svg>
                          Хадгалах
                        </button>
                      )}
                      {thread.pinned && (
                        <Link
                          href="#"
                          className="font-semibold text-ds-primary transition-colors hover:text-ds-primary/80"
                        >
                          Бүртгүүлэх
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
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
                  <div
                    className={`h-24 bg-gradient-to-br ${project.gradient}`}
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3">
                    <h4 className="text-sm font-bold text-white">
                      {project.title}
                    </h4>
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
                <span className="text-sm text-on-surface-variant">
                  Одоо онлайн
                </span>
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
                  <span className="text-xs text-on-surface-variant">
                    Сарын зорилго
                  </span>
                  <span className="text-xs font-medium text-ds-tertiary">
                    67%
                  </span>
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
      </div>
    </div>
  );
}
