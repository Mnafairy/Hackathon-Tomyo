import { Skeleton } from '@/components/ui/skeleton';

export default function DetailLoading() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="glass-panel animate-fade-up rounded-2xl p-8">
        {/* Type badge + subject badges */}
        <div className="mb-4 flex flex-wrap gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>

        {/* Title */}
        <Skeleton className="mb-2 h-8 w-3/4" />
        <Skeleton className="mb-6 h-8 w-1/2" />

        {/* Divider */}
        <div className="my-6 h-px bg-gradient-to-r from-transparent via-outline-variant/50 to-transparent" />

        {/* Description lines */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Metadata grid */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>

        {/* CTA button */}
        <Skeleton className="mt-8 h-12 w-48 rounded-full" />
      </div>
    </div>
  );
}
