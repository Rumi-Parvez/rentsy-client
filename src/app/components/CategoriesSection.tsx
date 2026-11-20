"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Loader2, RefreshCw, Search } from "lucide-react";

import {
  DEFAULT_EQUIPMENT_CATEGORIES,
  fetchEquipmentCategories,
  type EquipmentCategory,
} from "@/lib/equipmentCategories";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_SERVER || "http://localhost:5000";

export default function CategoriesSection() {
  const [categories, setCategories] = useState<EquipmentCategory[]>(
    DEFAULT_EQUIPMENT_CATEGORIES
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCategories = useCallback(async (queryText: string) => {
    try {
      setLoading(true);
      setError("");
      const items = await fetchEquipmentCategories(API_BASE_URL, queryText);
      setCategories(items);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load categories."
      );
      setCategories(DEFAULT_EQUIPMENT_CATEGORIES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadCategories(searchQuery);
    }, 150);

    return () => window.clearTimeout(timer);
  }, [loadCategories, searchQuery]);

  return (
    <section
      id="categories"
      className="w-full border-t border-slate-200/80 bg-white px-4 py-8 text-slate-900 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950 dark:text-white sm:px-6 sm:py-16 lg:px-8 lg:py-10"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header & Search */}
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2.5">
              <span className="h-px w-8 bg-[#6e13f9]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6e13f9] dark:text-[#a66cff]">
                Explore Categories
              </span>
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight sm:text-4xl">
              Popular equipment{" "}
              <span className="text-[#6e13f9] dark:text-[#a66cff]">
                categories.
              </span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter categories..."
                aria-label="Filter categories"
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs text-slate-900 outline-none transition focus:border-[#6e13f9] focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <Link
              href="/equipment"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 transition-colors hover:text-[#6e13f9] dark:text-slate-300 dark:hover:text-[#a66cff]"
            >
              <span>All equipment</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mt-8 flex items-center justify-center gap-2.5 rounded-2xl border border-slate-200 bg-slate-50 py-10 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin text-[#6e13f9]" />
            <span>Loading categories...</span>
          </div>
        )}

        {/* Error Banner */}
        {!loading && error && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">
            <span>Showing default categories ({error})</span>
            <button
              type="button"
              onClick={() => void loadCategories(searchQuery)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#6e13f9] px-3 py-1 font-semibold text-white hover:bg-[#5b0ed6]"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Empty Filter Result */}
        {!loading && categories.length === 0 && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 py-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
            No categories match &ldquo;{searchQuery}&rdquo;.
          </div>
        )}

        {/* Horizontal Circular Strip */}
        {!loading && categories.length > 0 && (
          <div className="mt-8 flex items-start gap-6 overflow-x-auto pb-4 pt-1 lg:grid lg:grid-cols-6 lg:gap-5 lg:overflow-visible lg:pb-0">
            {categories.map((cat) => (
              <Link
                key={cat.slug || cat.name}
                href={`/equipment?category=${encodeURIComponent(cat.name)}`}
                className="group flex w-32 shrink-0 flex-col items-center text-center lg:w-auto"
              >
                <div className="relative h-24 w-24 rounded-full border-2 border-slate-200 bg-slate-100 p-1 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#6e13f9] group-hover:shadow-[0_12px_24px_-8px_rgba(110,19,249,0.4)] dark:border-slate-800 dark:bg-slate-900 sm:h-28 sm:w-28">
                  <div className="relative h-full w-full overflow-hidden rounded-full">
                    <Image
                      src={cat.imageUrl}
                      alt={cat.name}
                      width={500}
                      height={500}
                      
                      className="object-cover object-center w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#6e13f9] px-2.5 py-0.5 text-[10px] font-bold text-white shadow">
                    {cat.equipmentCount}
                  </span>
                </div>

                <h3 className="mt-3.5 line-clamp-2 text-xs font-extrabold leading-snug text-slate-900 transition-colors group-hover:text-[#6e13f9] dark:text-white dark:group-hover:text-[#a66cff] sm:text-sm">
                  {cat.name}
                </h3>

                <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-slate-500 dark:text-slate-400">
                  {cat.description}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}