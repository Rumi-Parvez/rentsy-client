
"use client";

import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import EquipmentCard from "./EquipmentCard";
import { SERVER_URL } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

type MongoObjectId =
  | string
  | {
      $oid?: string;
    };

type FeaturedEquipmentItem = {
  _id: MongoObjectId;
  equipmentName: string;
  description?: string;
  category: string;
  location?: string;
  rentalPrice: number;
  rentalType?:
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | string;
  availableQuantity: number;
  condition?: string;
  brand?: string;
  model?: string;
  imageUrl?: string;
  status?: string;
};

const API_BASE_URL = SERVER_URL;

function normalizeId(
  value?: MongoObjectId
): string {
  if (!value) return "";

  if (typeof value === "string") {
    return value;
  }

  return value.$oid || "";
}

export default function FeaturedEquipmentSection() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const [items, setItems] = useState<
    FeaturedEquipmentItem[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // Fetch PUBLIC featured equipment
  // No JWT / Authorization header required
  // ==========================================

  const fetchFeaturedEquipment = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({
          status: "approved",
          limit: "6",
          sort: "recent",
        });

        const response = await fetch(
          `${API_BASE_URL}/api/equipment?${params.toString()}`,
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
          !contentType?.includes("application/json")
        ) {
          throw new Error(
            "Server returned an invalid response."
          );
        }

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Failed to load featured equipment."
          );
        }

        const equipmentList: FeaturedEquipmentItem[] =
          Array.isArray(data.equipment)
            ? data.equipment
            : [];

        setItems(equipmentList.slice(0, 6));
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load featured equipment."
        );

        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

useEffect(() => {
  const timer = window.setTimeout(() => {
    void fetchFeaturedEquipment();
  }, 0);

  return () => {
    window.clearTimeout(timer);
  };
}, [fetchFeaturedEquipment]);

  // ==========================================
  // View Equipment Details
  // ==========================================

  const handleViewDetails = async (id: string) => {
    if (!id) return;

    const targetPath = `/equipment/${id}`;

    try {
      const { data: session } =
        await authClient.getSession();

      if (!session?.user) {
        router.push(
          `/sign-in?redirect=${encodeURIComponent(
            targetPath
          )}`
        );

        return;
      }

      router.push(targetPath);
    } catch {
      router.push(
        `/sign-in?redirect=${encodeURIComponent(
          targetPath
        )}`
      );
    }
  };

  return (
    <section
      id="featured-equipment"
      className="w-full border-t border-slate-200/80 bg-slate-50 px-4 py-12 text-slate-900 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950 dark:text-white sm:px-6 sm:py-20 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">

        {/* Section Header */}

        <motion.div
          className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
          initial={reduceMotion ? undefined : { opacity: 0, y: 24, filter: "blur(8px)" }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
              Top approved{" "}
              <span className="text-[#6e13f9] dark:text-[#a66cff]">
                equipment.
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
              Handpicked, verified equipment ready for immediate jobsite,
              logistics, and project rental.
            </p>
          </div>

          <Link
            href="/equipment"
            className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-slate-700 transition-colors hover:text-[#6e13f9] dark:text-slate-300 dark:hover:text-[#a66cff]"
          >
            <span>Explore full catalog</span>

            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Loading State */}

        {loading && (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="h-52 w-full animate-pulse bg-slate-200 dark:bg-slate-800 sm:h-56" />

                  <div className="animate-pulse space-y-3 p-5">
                    <div className="h-5 w-3/4 rounded-full bg-slate-200 dark:bg-slate-800" />

                    <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800/70" />

                    <div className="h-3 w-5/6 rounded-full bg-slate-100 dark:bg-slate-800/70" />

                    <div className="flex items-center justify-between pt-2">
                      <div className="h-6 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />

                      <div className="h-8 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* Error State */}

        {!loading && error && (
          <div className="mt-12 rounded-3xl border border-red-200 bg-red-50 px-6 py-10 text-center dark:border-red-900/50 dark:bg-red-950/20">
            <h3 className="text-base font-bold text-red-700 dark:text-red-300">
              Unable to load featured equipment
            </h3>

            <p className="mx-auto mt-1.5 max-w-md text-sm text-red-600/80 dark:text-red-400/80">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                void fetchFeaturedEquipment()
              }
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#6e13f9] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5b0ed6]"
            >
              <RefreshCw className="h-4 w-4" />

              <span>Try Again</span>
            </button>
          </div>
        )}

        {/* Empty State */}

        {!loading &&
          !error &&
          items.length === 0 && (
            <div className="mt-12 rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-lg font-bold">
                No approved equipment available yet.
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                Approved listings will appear here once published.
              </p>
            </div>
          )}

        {/* Featured Equipment Grid */}

        {!loading &&
          !error &&
          items.length > 0 && (
            <motion.div
              className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              initial={reduceMotion ? undefined : "hidden"}
              whileInView={reduceMotion ? undefined : "show"}
              viewport={{ once: true, amount: 0.1 }}
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.08 } },
              }}
            >
              {items.map((item) => {
                const id = normalizeId(item._id);

                return (
                  <motion.div
                    key={id}
                    variants={{
                      hidden: {
                        opacity: 0,
                        y: 28,
                        scale: 0.97,
                        filter: "blur(8px)",
                      },
                      show: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        filter: "blur(0px)",
                        transition: {
                          duration: 0.55,
                          ease: [0.22, 1, 0.36, 1],
                        },
                      },
                    }}
                  >
                    <EquipmentCard
                      equipment={item}
                      onViewDetails={(equipmentId) =>
                        void handleViewDetails(
                          equipmentId
                        )
                      }
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          )}
      </div>
    </section>
  );
}
