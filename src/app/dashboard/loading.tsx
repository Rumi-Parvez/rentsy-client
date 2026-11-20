export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Page heading */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2.5">
          <div className="h-3 w-28 rounded-full bg-muted" />
          <div className="h-8 w-64 max-w-full rounded-2xl bg-muted" />
          <div className="h-3 w-80 max-w-full rounded-full bg-muted" />
        </div>
        <div className="h-10 w-32 rounded-xl bg-muted" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-border/70 bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 rounded-full bg-muted" />
              <div className="h-9 w-9 rounded-xl bg-muted" />
            </div>
            <div className="mt-4 h-8 w-20 rounded-xl bg-muted" />
            <div className="mt-3 h-3 w-32 rounded-full bg-muted" />
          </div>
        ))}
      </div>

      {/* Chart + side panel */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-border/70 bg-card p-5 xl:col-span-2">
          <div className="h-4 w-40 rounded-full bg-muted" />
          <div className="mt-2 h-3 w-64 rounded-full bg-muted" />
          <div className="mt-6 h-64 rounded-2xl bg-muted/70" />
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-5">
          <div className="h-4 w-32 rounded-full bg-muted" />
          <div className="mt-5 space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-2/3 rounded-full bg-muted" />
                  <div className="h-2.5 w-1/2 rounded-full bg-muted/70" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border/70 bg-card p-5">
        <div className="h-4 w-44 rounded-full bg-muted" />
        <div className="mt-5 space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-12 rounded-xl bg-muted/60" />
          ))}
        </div>
      </div>
    </div>
  );
}
