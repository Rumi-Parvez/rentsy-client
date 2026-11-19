"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/providers/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:border-[#6e13f9]/50 hover:text-[#6e13f9] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#8b45ff] dark:hover:text-[#b488ff]"
    >
      {isDark ? (
        <>
          <Sun className="h-4 w-4 text-amber-400" />
          <span>Light</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4 text-[#6e13f9]" />
          <span>Dark</span>
        </>
      )}
    </button>
  );
}