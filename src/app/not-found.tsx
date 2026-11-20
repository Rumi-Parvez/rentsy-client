import Link from "next/link";
import { ArrowLeft, Compass, Home, LifeBuoy, Search } from "lucide-react";

const helpfulLinks = [
  { label: "Browse equipment", href: "/equipment", icon: Search },
  { label: "How it works", href: "/how-it-works", icon: Compass },
  { label: "Get support", href: "/support", icon: LifeBuoy },
];

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center bg-slate-50 px-4 py-16 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#6e13f9]/20 bg-[#6e13f9]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#6e13f9] dark:border-[#a66cff]/30 dark:bg-[#6e13f9]/20 dark:text-[#c4a4ff]">
          <Compass className="h-3.5 w-3.5" />
          Error 404
        </span>

        <p
          aria-hidden="true"
          className="mt-6 bg-gradient-to-b from-[#6e13f9] to-[#a66cff] bg-clip-text text-[92px] font-black leading-none tracking-tight text-transparent sm:text-[140px]"
        >
          404
        </p>

        <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-4xl">
          This page took a wrong turn.
        </h1>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
          The page you are looking for may have been moved, renamed, or never
          existed. Let&apos;s get you back to the equipment.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#6e13f9] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#6e13f9]/20 transition hover:bg-[#5b0ed6] sm:w-auto"
          >
            <Home className="h-4 w-4" />
            Back to home
          </Link>

          <Link
            href="/equipment"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-[#6e13f9] hover:text-[#6e13f9] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#a66cff] dark:hover:text-[#a66cff] sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Browse equipment
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {helpfulLinks.map((link) => {
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-[#6e13f9]/40 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-[#a66cff]/40"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#6e13f9]/10 text-[#6e13f9] dark:bg-[#6e13f9]/20 dark:text-[#c4a4ff]">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-xs font-semibold text-slate-700 transition group-hover:text-[#6e13f9] dark:text-slate-300 dark:group-hover:text-[#a66cff]">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
