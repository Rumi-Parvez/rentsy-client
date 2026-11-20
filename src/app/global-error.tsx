"use client";

import { useEffect } from "react";
import "./globals.css";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry?: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-slate-950 antialiased">
        <main className="flex min-h-screen w-full items-center justify-center px-4 py-16">
          <div className="mx-auto w-full max-w-xl rounded-3xl border border-white/10 bg-slate-900 p-8 text-center text-white shadow-2xl sm:p-12">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-500/15 text-rose-300">
              <AlertTriangle className="h-8 w-8" />
            </span>

            <h1 className="mt-6 text-2xl font-extrabold tracking-tight sm:text-3xl">
              rEntsy could not start this page.
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-400">
              A critical error interrupted the application. Reload the page to
              restart the experience.
            </p>

            {error?.digest && (
              <p className="mt-4 inline-block rounded-full bg-white/5 px-3 py-1 font-mono text-[11px] text-slate-400">
                Reference: {error.digest}
              </p>
            )}

            <button
              type="button"
              onClick={() => retry?.()}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#6e13f9] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#5b0ed6] sm:w-auto"
            >
              <RefreshCw className="h-4 w-4" />
              Reload application
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
