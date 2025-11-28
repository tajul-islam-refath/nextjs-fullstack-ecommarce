export function CategoryProductSkeleton() {
  return (
    <>
      <div className="mb-8">
        <div className="h-6 w-32 animate-pulse rounded bg-slate-200" />
      </div>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white"
          >
            <div className="aspect-square w-full animate-pulse bg-slate-200" />
            <div className="p-4 space-y-3">
              <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
