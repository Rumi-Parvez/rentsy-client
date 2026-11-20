"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, RefreshCw, Search, SlidersHorizontal } from "lucide-react";

import { SERVER_URL } from "@/lib/api";
import {
  DEFAULT_EQUIPMENT_CATEGORIES,
  fetchEquipmentCategories,
  type EquipmentCategory,
} from "@/lib/equipmentCategories";

export default function CategoriesBrowser() {
  const [categories, setCategories] = useState<EquipmentCategory[]>(
    DEFAULT_EQUIPMENT_CATEGORIES
  );
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (search: string) => {
    try {
      setLoading(true);
      setError("");
      const items = await fetchEquipmentCategories(SERVER_URL, search);
      setCategories(items);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load categories."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load("");
    }, 0);

    return () => window.clearTimeout(timer);
  }, [load]);

  const filtered = query.trim()
    ? categories.filter(
        (category) =>
          category.name.toLowerCase().includes(query.trim().toLowerCase()) ||
          category.description
            .toLowerCase()
            .includes(query.trim().toLowerCase())
      )
    : categories;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search categories, e.g. vehicles or photography..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3.5 text-sm text-slate-900 outline-none transition focus:border-[#6e13f9] focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <SlidersHorizontal className="h-4 w-4 text-[#6e13f9] dark:text-[#a66cff]" />
          <span>
            {loading
              ? "Loading categories..."
              : `${filtered.length} categories available`}
          </span>
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="h-40 w-full bg-slate-200 dark:bg-slate-800" />
              <div className="space-y-3 p-5">
                <div className="h-4 w-2/3 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800/70" />
                <div className="h-3 w-4/5 rounded-full bg-slate-100 dark:bg-slate-800/70" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/50 dark:bg-red-950/20">
          <p className="text-sm font-semibold text-red-700 dark:text-red-300">
            {error}
          </p>
          <button
            type="button"
            onClick={() => void load(query)}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#6e13f9] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#5b0ed6]"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Try again
          </button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base font-bold">No categories match your search</h2>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Try a broader keyword or browse all available equipment.
          </p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((category) => (
            <Link
              key={category.slug || category.name}
              href={`/equipment?category=${encodeURIComponent(category.name)}`}
              className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#6e13f9]/40 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="relative h-40 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-slate-950/75 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                  {category.equipmentCount} listings
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h2 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {category.name}
                </h2>
                <p className="mt-1.5 flex-1 text-xs leading-6 text-slate-500 dark:text-slate-400">
                  {category.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#6e13f9] dark:text-[#a66cff]">
                  Browse category
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
