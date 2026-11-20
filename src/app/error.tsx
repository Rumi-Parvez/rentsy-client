"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, LifeBuoy, RefreshCw } from "lucide-react";

export default function AppError({
  error,
  retry,
  reset,
}: {
  error: Error & { digest?: string };
  retry?: () => void;
  reset?: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled application error:", error);
  }, [error]);

  const handleRetry = () => {
    if (retry) {
      retry();
      return;
    }

    reset?.();
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center bg-slate-50 px-4 py-16 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-2xl">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#6e13f9] via-[#a66cff] to-[#6e13f9]" />

          <div className="p-7 text-center sm:p-12">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300">
              <AlertTriangle className="h-8 w-8" />
            </span>

            <h1 className="mt-6 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Something went wrong.
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-600 dark:text-slate-400">
              We hit an unexpected error while loading this page. Your data is
              safe — please try again, or head back to a working page.
            </p>

            {error?.digest && (
              <p className="mt-4 inline-block rounded-full bg-slate-100 px-3 py-1 font-mono text-[11px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                Reference: {error.digest}
              </p>
            )}

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#6e13f9] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#6e13f9]/20 transition hover:bg-[#5b0ed6] sm:w-auto"
              >
                <RefreshCw className="h-4 w-4" />
                Try again
              </button>

              <Link
                href="/"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-[#6e13f9] hover:text-[#6e13f9] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#a66cff] dark:hover:text-[#a66cff] sm:w-auto"
              >
                <Home className="h-4 w-4" />
                Back to home
              </Link>
            </div>

            <Link
              href="/support"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-[#6e13f9] dark:text-slate-400 dark:hover:text-[#a66cff]"
            >
              <LifeBuoy className="h-3.5 w-3.5" />
              Still stuck? Contact support
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
