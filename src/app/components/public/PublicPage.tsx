import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

export function PublicPage({
  eyebrow,
  title,
  highlight,
  description,
  action,
  children,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-slate-50 px-4 py-10 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#6e13f9]/20 bg-[#6e13f9]/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#6e13f9] dark:border-[#a66cff]/25 dark:bg-[#6e13f9]/20 dark:text-[#c4a4ff]">
            <Sparkles className="h-3.5 w-3.5" />
            {eyebrow}
          </span>

          <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {title}{" "}
            {highlight && (
              <span className="text-[#6e13f9] dark:text-[#a66cff]">
                {highlight}
              </span>
            )}
          </h1>

          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
            {description}
          </p>

          {action && <div className="mt-7">{action}</div>}
        </header>

        <div className="mt-10 space-y-10 sm:mt-12 sm:space-y-12">{children}</div>
      </div>
    </div>
  );
}

export function SectionTitle({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">
        {title}
      </h2>
      {description && (
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}

export function InfoCard({
  icon,
  title,
  children,
  href,
  linkLabel,
}: {
  icon?: ReactNode;
  title: string;
  children: ReactNode;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#6e13f9]/30 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      {icon && (
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6e13f9]/10 text-[#6e13f9] dark:bg-[#6e13f9]/20 dark:text-[#c4a4ff]">
          {icon}
        </span>
      )}

      <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
        {title}
      </h3>

      <div className="mt-2 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
        {children}
      </div>

      {href && (
        <Link
          href={href}
          className="group mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#6e13f9] transition hover:underline dark:text-[#a66cff]"
        >
          <span>{linkLabel || "Learn more"}</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

export function CtaPanel({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2b0a63] via-[#4c139f] to-[#6e13f9] px-6 py-10 text-white shadow-xl sm:px-10 sm:py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-black/20 blur-2xl"
      />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-purple-100">
            {description}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={primaryHref}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#3b0c8f] transition hover:bg-purple-50"
          >
            {primaryLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>

          {secondaryHref && secondaryLabel && (
            <Link
              href={secondaryHref}
              className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

export function LegalLayout({
  updated,
  children,
}: {
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <p className="mb-6 inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          Last updated: {updated}
        </p>

        <div className="space-y-7 text-sm leading-7 text-slate-600 dark:text-slate-400">
          {children}
        </div>
      </article>

      <aside className="h-fit space-y-4 lg:sticky lg:top-24">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Need help?
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Questions about this policy? Our support team responds within one
            business day.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#6e13f9] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#5b0ed6]"
          >
            Contact support
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Related pages
          </p>
          <div className="mt-3 space-y-2 text-xs font-semibold">
            {[
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Terms of Service", href: "/terms-of-service" },
              { label: "Cookie Policy", href: "/cookie-policy" },
              { label: "Contact Us", href: "/contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-2 py-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-[#6e13f9] dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-[#a66cff]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-base font-bold text-slate-900 dark:text-white">
        {title}
      </h2>
      <div className="mt-2 space-y-3">{children}</div>
    </section>
  );
}
