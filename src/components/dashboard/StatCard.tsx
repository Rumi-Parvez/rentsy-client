import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const toneMap = {
  violet:
    "bg-violet-50 text-violet-600 ring-violet-600/10 dark:bg-violet-500/12 dark:text-violet-300 dark:ring-violet-400/20",
  emerald:
    "bg-emerald-50 text-emerald-600 ring-emerald-600/10 dark:bg-emerald-500/12 dark:text-emerald-300 dark:ring-emerald-400/20",
  sky: "bg-sky-50 text-sky-600 ring-sky-600/10 dark:bg-sky-500/12 dark:text-sky-300 dark:ring-sky-400/20",
  amber:
    "bg-amber-50 text-amber-600 ring-amber-600/10 dark:bg-amber-500/12 dark:text-amber-300 dark:ring-amber-400/20",
  rose: "bg-rose-50 text-rose-600 ring-rose-600/10 dark:bg-rose-500/12 dark:text-rose-300 dark:ring-rose-400/20",
  slate:
    "bg-slate-100 text-slate-600 ring-slate-600/10 dark:bg-slate-800 dark:text-slate-300 dark:ring-white/10",
};

export type StatTone = keyof typeof toneMap;

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: StatTone;
  hint?: string;
  trend?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "violet",
  hint,
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "group relative min-w-0 overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors duration-200 hover:border-primary/30",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 truncate text-2xl font-bold tracking-tight text-foreground sm:text-[27px]">
            {value}
          </p>
        </div>

        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1",
            toneMap[tone]
          )}
        >
          <Icon className="h-[19px] w-[19px]" />
        </span>
      </div>

      {(hint || trend) && (
        <div className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
          {trend && (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
              {trend}
            </span>
          )}
          {hint && <span className="truncate">{hint}</span>}
        </div>
      )}
    </div>
  );
}
