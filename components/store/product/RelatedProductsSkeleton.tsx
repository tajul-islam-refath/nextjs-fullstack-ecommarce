export function RelatedProductsSkeleton() {
  return (
    <section className="py-12">
      {/* Section Header */}
      <div className="mb-6">
        <div className="h-8 w-48 animate-pulse rounded bg-(--gray-200)" />
      </div>

      {/* Products Grid */}
      <div className="flex gap-4 overflow-hidden pb-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-64 shrink-0">
            <div className="overflow-hidden rounded-xl border border-(--gray-200)">
              <div className="aspect-square w-full animate-pulse bg-(--gray-200)" />
              <div className="p-4 space-y-2">
                <div className="h-3 w-16 animate-pulse rounded bg-(--gray-200)" />
                <div className="h-4 w-full animate-pulse rounded bg-(--gray-200)" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-(--gray-200)" />
                <div className="h-5 w-20 animate-pulse rounded bg-(--gray-200)" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
