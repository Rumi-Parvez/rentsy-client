export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-slate-50 px-4 py-12 transition-colors duration-300 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full max-w-xl space-y-3">
            <div className="h-4 w-32 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="h-10 w-full max-w-md rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-full max-w-sm rounded-full bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="h-11 w-40 rounded-xl bg-slate-200 dark:bg-slate-800" />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="h-12 w-12 rounded-2xl bg-slate-200 dark:bg-slate-800" />
              <div className="mt-5 h-5 w-2/3 rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="mt-3 space-y-2">
                <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800/70" />
                <div className="h-3 w-5/6 rounded-full bg-slate-100 dark:bg-slate-800/70" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
