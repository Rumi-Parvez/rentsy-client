export type PageSkeletonVariant = "table" | "cards" | "form" | "profile";

export function PageSkeleton({
  variant = "table",
  rows = 6,
}: {
  variant?: PageSkeletonVariant;
  rows?: number;
}) {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2.5">
          <div className="h-3 w-24 rounded-full bg-muted" />
          <div className="h-8 w-56 max-w-full rounded-2xl bg-muted" />
          <div className="h-3 w-72 max-w-full rounded-full bg-muted" />
        </div>
        <div className="h-10 w-28 rounded-xl bg-muted" />
      </div>

      {variant === "table" && (
        <div className="rounded-2xl border border-border/70 bg-card p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="h-10 w-full max-w-xs rounded-xl bg-muted" />
            <div className="h-10 w-28 rounded-xl bg-muted" />
          </div>

          <div className="mt-5 space-y-2.5">
            {Array.from({ length: rows }).map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-[1.4fr_1fr_1fr_0.8fr] items-center gap-3 rounded-xl bg-muted/50 p-3.5"
              >
                <div className="h-3.5 w-full rounded-full bg-muted" />
                <div className="h-3.5 w-4/5 rounded-full bg-muted" />
                <div className="h-3.5 w-3/5 rounded-full bg-muted" />
                <div className="h-7 w-16 justify-self-end rounded-full bg-muted" />
              </div>
            ))}
          </div>
        </div>
      )}

      {variant === "cards" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: rows }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-border/70 bg-card"
            >
              <div className="h-36 w-full bg-muted" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-2/3 rounded-full bg-muted" />
                <div className="h-3 w-full rounded-full bg-muted/70" />
                <div className="h-3 w-4/5 rounded-full bg-muted/70" />
                <div className="flex items-center justify-between pt-2">
                  <div className="h-5 w-20 rounded-full bg-muted" />
                  <div className="h-7 w-16 rounded-full bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {variant === "form" && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="space-y-5 rounded-2xl border border-border/70 bg-card p-6 xl:col-span-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="h-3 w-24 rounded-full bg-muted" />
                  <div className="h-11 rounded-xl bg-muted" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-24 rounded-full bg-muted" />
                  <div className="h-11 rounded-xl bg-muted" />
                </div>
              </div>
            ))}
            <div className="space-y-2">
              <div className="h-3 w-28 rounded-full bg-muted" />
              <div className="h-28 rounded-xl bg-muted" />
            </div>
            <div className="h-11 w-36 rounded-xl bg-muted" />
          </div>

          <div className="h-72 rounded-2xl border border-border/70 bg-card p-6">
            <div className="h-4 w-32 rounded-full bg-muted" />
            <div className="mt-5 space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-10 rounded-xl bg-muted/70" />
              ))}
            </div>
          </div>
        </div>
      )}

      {variant === "profile" && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="rounded-2xl border border-border/70 bg-card p-6">
            <div className="mx-auto h-24 w-24 rounded-full bg-muted" />
            <div className="mx-auto mt-5 h-5 w-36 rounded-full bg-muted" />
            <div className="mx-auto mt-3 h-3 w-48 rounded-full bg-muted" />
            <div className="mt-6 space-y-3">
              <div className="h-10 rounded-xl bg-muted/70" />
              <div className="h-10 rounded-xl bg-muted/70" />
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-border/70 bg-card p-6 xl:col-span-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-3 w-28 rounded-full bg-muted" />
                <div className="h-11 rounded-xl bg-muted" />
              </div>
            ))}
            <div className="h-11 w-32 rounded-xl bg-muted" />
          </div>
        </div>
      )}
    </div>
  );
}
