import Link from 'next/link';

import type { Thread } from '@/features/community/community-data';

interface ThreadCardProps {
  thread: Thread;
  delay: string;
}

export const ThreadCard = ({ thread, delay }: ThreadCardProps) => {
  return (
    <article
      className={`animate-fade-up ${delay} glass-card glow-border rounded-2xl p-5 ${
        thread.highlighted ? 'border-l-[3px] border-l-ds-tertiary' : ''
      } ${thread.pinned ? 'opacity-80 transition-opacity hover:opacity-100' : ''}`}
    >
      {/* Pinned Badge */}
      {thread.pinned && (
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-ds-tertiary/20 bg-gradient-to-r from-ds-tertiary/20 to-ds-primary/20 px-3 py-1 text-xs font-medium text-on-tertiary-container">
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
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
        <ThreadVoteColumn votes={thread.votes} />
        <ThreadContent thread={thread} />
      </div>
    </article>
  );
};

interface ThreadVoteColumnProps {
  votes: number;
}

const ThreadVoteColumn = ({ votes }: ThreadVoteColumnProps) => (
  <div className="flex flex-col items-center gap-1 pt-1">
    <button className="text-on-surface-variant transition-colors hover:text-ds-primary">
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    </button>
    <span className="heading-section text-sm font-bold text-ds-primary">{votes}</span>
    <button className="text-on-surface-variant transition-colors hover:text-ds-tertiary">
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  </div>
);

interface ThreadContentProps {
  thread: Thread;
}

const ThreadContent = ({ thread }: ThreadContentProps) => (
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
        <svg className="h-4 w-4 text-ds-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
        </svg>
        <span className="font-medium text-on-surface">{thread.attachment.name}</span>
        <span className="text-on-surface-variant">{thread.attachment.size}</span>
      </div>
    )}

    {/* Actions */}
    <div className="mt-4 flex items-center gap-5 text-xs text-on-surface-variant">
      <button className="flex items-center gap-1.5 transition-colors hover:text-ds-primary">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        {thread.comments} Сэтгэгдэл
      </button>
      <button className="flex items-center gap-1.5 transition-colors hover:text-ds-primary">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Хуваалцах
      </button>
      {!thread.pinned && (
        <button className="flex items-center gap-1.5 transition-colors hover:text-ds-primary">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
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
);
