"use client";

import Link from "next/link";

import {
  ArrowRight,
  ChevronRight,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState } from "react";

type Category = {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  equipmentCount: number;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_SERVER ||
  "http://localhost:5000";

export default function CategoriesSection() {
  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/equipment/categories`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        }
      );

      const contentType =
        response.headers.get("content-type");

      if (
        !contentType?.includes(
          "application/json"
        )
      ) {
        throw new Error(
          "Server returned an invalid response."
        );
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to fetch categories."
        );
      }

      setCategories(
        Array.isArray(data.categories)
          ? data.categories
          : []
      );
    } catch (error) {
      console.error(
        "Category fetch error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch categories."
      );

      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchCategories();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <section
      id="categories"
      className="
        w-full
        bg-white
        px-4
        py-16
        text-slate-900
        transition-colors
        duration-300

        dark:bg-slate-950
        dark:text-white

        sm:px-6
        sm:py-20

        lg:px-8
        lg:py-24
      "
    >
      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            SECTION HEADER
        ===================================================== */}

        <div
          className="
            flex
            flex-col
            gap-6

            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-3">
              <span
                className="
                  h-px
                  w-10
                  bg-[#6e13f9]
                "
              />

              <span
                className="
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-[#6e13f9]
                  dark:text-[#a66cff]
                "
              >
                Explore Rentals
              </span>
            </div>

            <h2
              className="
                text-3xl
                font-bold
                leading-[1.1]
                tracking-tight

                sm:text-4xl

                lg:text-5xl
              "
            >
              Find the right equipment
              <br className="hidden sm:block" />

              <span
                className="
                  text-[#6e13f9]
                  dark:text-[#a66cff]
                "
              >
                {" "}for every job.
              </span>
            </h2>

            <p
              className="
                mt-5
                max-w-xl
                text-sm
                leading-7
                text-slate-500

                sm:text-base

                dark:text-slate-400
              "
            >
              Explore professional equipment
              categories built for construction,
              transportation, agriculture, events,
              maintenance, and more.
            </p>
          </div>

          <Link
            href="/categories"
            className="
              group
              inline-flex
              w-fit
              items-center
              gap-2
              text-sm
              font-semibold
              text-slate-700
              transition-colors

              hover:text-[#6e13f9]

              dark:text-slate-300
              dark:hover:text-[#a66cff]
            "
          >
            View all categories

            <ArrowRight
              className="
                h-4
                w-4
                transition-transform
                duration-200
                group-hover:translate-x-1
              "
            />
          </Link>
        </div>

        {/* =====================================================
            LOADING
        ===================================================== */}

        {loading && (
          <div
            className="
              mt-12
              flex
              min-h-[320px]
              items-center
              justify-center
              rounded-3xl
              border
              border-slate-200
              bg-slate-50

              dark:border-slate-800
              dark:bg-slate-900/50
            "
          >
            <div className="flex items-center gap-3">
              <Loader2
                className="
                  h-5
                  w-5
                  animate-spin
                  text-[#6e13f9]
                "
              />

              <span
                className="
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Loading rental categories...
              </span>
            </div>
          </div>
        )}

        {/* =====================================================
            ERROR
        ===================================================== */}

        {!loading && error && (
          <div
            className="
              mt-12
              rounded-3xl
              border
              border-red-200
              bg-red-50
              px-6
              py-10
              text-center

              dark:border-red-900/50
              dark:bg-red-950/20
            "
          >
            <h3
              className="
                text-base
                font-semibold
                text-red-700

                dark:text-red-300
              "
            >
              Unable to load categories
            </h3>

            <p
              className="
                mx-auto
                mt-2
                max-w-md
                text-sm
                leading-6
                text-red-600/80

                dark:text-red-400/80
              "
            >
              {error}
            </p>

            <button
              type="button"
              onClick={fetchCategories}
              className="
                mt-5
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-[#6e13f9]
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#5b0ed6]
              "
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        )}

        {/* =====================================================
            EMPTY
        ===================================================== */}

        {!loading &&
          !error &&
          categories.length === 0 && (
            <div
              className="
                mt-12
                rounded-3xl
                border
                border-slate-200
                bg-slate-50
                px-6
                py-14
                text-center

                dark:border-slate-800
                dark:bg-slate-900
              "
            >
              <h3
                className="
                  text-lg
                  font-semibold
                "
              >
                No equipment categories available yet.
              </h3>

              <p
                className="
                  mx-auto
                  mt-2
                  max-w-md
                  text-sm
                  leading-6
                  text-slate-500

                  dark:text-slate-400
                "
              >
                Categories will appear here once
                rental equipment is available.
              </p>
            </div>
          )}

        {/* =====================================================
            CATEGORY GRID
        ===================================================== */}

        {!loading &&
          !error &&
          categories.length > 0 && (
            <div
              className="
                mt-12
                grid
                grid-cols-1
                gap-4

                sm:grid-cols-2

                lg:grid-cols-4
              "
            >
              {categories.map((category, index) => (
                <CategoryCard
                  key={category.slug}
                  category={category}
                  featured={index === 0}
                />
              ))}
            </div>
          )}
      </div>
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Category Card
|--------------------------------------------------------------------------
*/

function CategoryCard({
  category,
  featured,
}: {
  category: Category;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/equipment?category=${encodeURIComponent(
        category.name
      )}`}
      className={`
        group
        relative
        block
        overflow-hidden
        rounded-[22px]
        border
        border-white/10
        bg-slate-900

        transition-all
        duration-300

        hover:-translate-y-1
        hover:border-[#6e13f9]/60

        ${
          featured
            ? "sm:row-span-2"
            : ""
        }
      `}
    >
      <div
        className={`
          relative
          overflow-hidden

          ${
            featured
              ? "h-[430px]"
              : "h-[260px]"
          }

          sm:h-[280px]

          ${
            featured
              ? "sm:h-full sm:min-h-[580px]"
              : ""
          }
        `}
      >
        {/* Image */}

        <img
          src={category.imageUrl}
          alt={`${category.name} equipment rental`}
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover

            transition-transform
            duration-700

            group-hover:scale-105
          "
        />

        {/* Image Overlay */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black
            via-black/35
            to-transparent
          "
        />

        {/* Top Badge */}

        <div
          className="
            absolute
            left-4
            top-4
            rounded-full
            border
            border-white/20
            bg-black/35
            px-3
            py-1.5
            backdrop-blur-md
          "
        >
          <span
            className="
              text-[9px]
              font-bold
              uppercase
              tracking-[0.14em]
              text-white
            "
          >
            Rental Category
          </span>
        </div>

        {/* Bottom Content */}

        <div
          className="
            absolute
            inset-x-0
            bottom-0
            p-5
            sm:p-6
          "
        >
          <div className="flex items-end justify-between gap-4">

            <div className="min-w-0">
              <h3
                className="
                  text-xl
                  font-bold
                  leading-tight
                  tracking-tight
                  text-white

                  sm:text-2xl
                "
              >
                {category.name}
              </h3>

              <p
                className="
                  mt-2
                  max-w-[280px]
                  text-xs
                  leading-5
                  text-white/75

                  sm:text-sm
                "
              >
                {category.description}
              </p>

              <p
                className="
                  mt-3
                  text-[11px]
                  font-medium
                  text-white/60
                "
              >
                {category.equipmentCount}{" "}
                {category.equipmentCount === 1
                  ? "equipment"
                  : "equipment"}{" "}
                available
              </p>
            </div>

            {/* Arrow */}

            <span
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                border-white/25
                bg-black/30
                text-white
                backdrop-blur-sm
                transition-all
                duration-300

                group-hover:border-[#6e13f9]
                group-hover:bg-[#6e13f9]
              "
            >
              <ChevronRight
                className="
                  h-4
                  w-4
                  transition-transform
                  duration-300
                  group-hover:translate-x-0.5
                "
              />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}