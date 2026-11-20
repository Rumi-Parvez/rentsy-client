"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

import {
  ArrowRight,
  Filter,
  MapPin,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import EquipmentCard from "../components/EquipmentCard";
import { SERVER_URL } from "@/lib/api";

type EquipmentItem = {
  _id: string;
  equipmentName: string;
  description: string;
  category: string;
  location: string;
  rentalPrice: number;
  rentalType: "hourly" | "daily" | "weekly" | "monthly" | string;
  availableQuantity: number;
  condition: string;
  brand: string;
  model: string;
  imageUrl: string;
  ownerName?: string;
};

const API_BASE_URL = SERVER_URL;

const FALLBACK_EQUIPMENT_IMAGE =
  "https://d2uhsaoc6ysewq.cloudfront.net/28475/Excavators-John-Deere-160G-LC-24984571.jpg";

const DEFAULT_CATEGORIES = [
  "Excavator",
  "Forklift",
  "Boom Lift",
  "Concrete Mixer",
  "Crane Truck",
  "Generator",
  "Scaffolding Set",
  "Pressure Washer",
];

const DEFAULT_RENTAL_TYPES = ["hourly", "daily", "weekly", "monthly"];

function EquipmentCatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlCategory = searchParams.get("category") || "";
  const urlSearch = searchParams.get("search") || "";

  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [rentalTypes, setRentalTypes] = useState<string[]>(DEFAULT_RENTAL_TYPES);

  // Local overrides when user types/filters; falls back to URL params when URL changes
  const [searchOverride, setSearchOverride] = useState<string | null>(null);
  const [categoryOverride, setCategoryOverride] = useState<string | null>(null);

  const search = searchOverride !== null ? searchOverride : urlSearch;
  const category = categoryOverride !== null ? categoryOverride : urlCategory;

  const [rentalType, setRentalType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("recent");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadMeta = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/equipment/meta`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (active && res.ok && data.success) {
          if (Array.isArray(data.categories) && data.categories.length) {
            setCategories(data.categories);
          }
          if (Array.isArray(data.rentalTypes) && data.rentalTypes.length) {
            setRentalTypes(data.rentalTypes);
          }
        }
      } catch {
        // Keep defaults on transient network error
      }
    };

    void loadMeta();
    return () => {
      active = false;
    };
  }, []);

  const fetchEquipment = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (category) params.set("category", category);
      if (rentalType) params.set("rentalType", rentalType);
      if (minPrice !== "") params.set("minPrice", minPrice);
      if (maxPrice !== "") params.set("maxPrice", maxPrice);
      if (sort) params.set("sort", sort);

      const url = `${API_BASE_URL}/api/equipment${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const res = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load equipment.");
      }

      setEquipment(Array.isArray(data.equipment) ? data.equipment : []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load equipment."
      );
      setEquipment([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, rentalType, minPrice, maxPrice, sort]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchEquipment();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchEquipment]);

  const handleSearchChange = (value: string) => {
    setSearchOverride(value);
  };

  const handleCategoryChange = (nextCategory: string) => {
    setCategoryOverride(nextCategory);
    const params = new URLSearchParams(searchParams.toString());
    if (nextCategory) {
      params.set("category", nextCategory);
    } else {
      params.delete("category");
    }
    router.replace(
      `/equipment${params.toString() ? `?${params.toString()}` : ""}`
    );
  };

  const handleResetFilters = () => {
    setSearchOverride("");
    setCategoryOverride("");
    setRentalType("");
    setMinPrice("");
    setMaxPrice("");
    setSort("recent");
    router.replace("/equipment");
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 px-4 py-10 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
        
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Browse Rental{" "}
              <span className="text-[#6e13f9] dark:text-[#a66cff]">
                Equipment
              </span>
            </h1>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
              Filter by category, rental billing cycle, price range, and site
              location.
            </p>
          </div>

          
        </div>

        {/* Filter Bar */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:grid-cols-6">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search name, brand, location..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3.5 text-sm text-slate-900 outline-none transition focus:border-[#6e13f9] focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Category */}
            <div>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#6e13f9] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Rental Type */}
            <div>
              <select
                value={rentalType}
                onChange={(e) => setRentalType(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm capitalize text-slate-900 outline-none transition focus:border-[#6e13f9] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="">All Rental Types</option>
                {rentalTypes.map((type) => (
                  <option key={type} value={type} className="capitalize">
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Min & Max */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min $"
                className="w-1/2 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2.5 text-sm text-slate-900 outline-none focus:border-[#6e13f9] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max $"
                className="w-1/2 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2.5 text-sm text-slate-900 outline-none focus:border-[#6e13f9] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Sort */}
            <div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#6e13f9] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="recent">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name">Name (A–Z)</option>
              </select>
            </div>
          </div>

          {/* Quick Category Pills */}
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3.5 dark:border-slate-800">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Categories:
            </span>
            <button
              type="button"
              onClick={() => handleCategoryChange("")}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                category === ""
                  ? "bg-[#6e13f9] text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  category === cat
                    ? "bg-[#6e13f9] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {cat}
              </button>
            ))}
            {(search || category || rentalType || minPrice || maxPrice) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="ml-auto text-xs font-semibold text-[#6e13f9] hover:underline dark:text-[#a66cff]"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="h-52 w-full animate-pulse bg-slate-200 dark:bg-slate-800 sm:h-56" />
                <div className="animate-pulse space-y-3 p-5">
                  <div className="h-5 w-3/4 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800/70" />
                  <div className="h-3 w-5/6 rounded-full bg-slate-100 dark:bg-slate-800/70" />
                  <div className="h-3 w-1/2 rounded-full bg-slate-100 dark:bg-slate-800/70" />
                  <div className="flex items-center justify-between pt-2">
                    <div className="h-6 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="h-8 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/50 dark:bg-red-950/20">
            <p className="text-sm font-semibold text-red-700 dark:text-red-300">
              {error}
            </p>
            <button
              type="button"
              onClick={() => void fetchEquipment()}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#6e13f9] px-4 py-2 text-xs font-semibold text-white hover:bg-[#5b0ed6]"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && equipment.length === 0 && (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-bold">No matching equipment found</h2>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              Try adjusting your search keywords or resetting filters.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-4 rounded-full bg-[#6e13f9] px-5 py-2 text-xs font-semibold text-white hover:bg-[#5b0ed6]"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && equipment.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {equipment.map((item) => (
             
                <EquipmentCard key={item._id} equipment={item} />
             
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function EquipmentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl animate-pulse">
            <div className="h-9 w-72 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="mt-3 h-3 w-96 max-w-full rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="mt-8 h-28 rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-80 rounded-3xl bg-slate-200 dark:bg-slate-800"
                />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <EquipmentCatalogContent />
    </Suspense>
  );
}