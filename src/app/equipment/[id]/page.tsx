"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  CreditCard,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";

type MongoObjectId = string | { $oid?: string };
type MongoDate = string | { $date?: string };

type EquipmentRecord = {
  _id: MongoObjectId;
  equipmentName: string;
  description?: string;
  category: string;
  location?: string;
  rentalPrice: number;
  rentalType?: "hourly" | "daily" | "weekly" | "monthly" | string;
  availableQuantity: number;
  condition?: string;
  brand?: string;
  model?: string;
  imageUrl?: string;
  rentalTerms?: string;
  status?: "pending" | "approved" | "rejected" | string;
  ownerId?: MongoObjectId;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  createdAt?: MongoDate;
  updatedAt?: MongoDate;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_SERVER || "http://localhost:5000";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1503708928676-1cb796a0891e?auto=format&fit=crop&w=900&q=80";

function normalizeId(val?: MongoObjectId): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  return val.$oid || "";
}

function normalizeDateString(val?: MongoDate): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  return val.$date || "";
}

function getTodayDateInputValue(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function calculateRentalUnits(
  startDateStr: string,
  endDateStr: string,
  rentalType?: string
): number {
  if (!startDateStr || !endDateStr) return 1;

  const start = new Date(`${startDateStr}T00:00:00`);
  const end = new Date(`${endDateStr}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 1;

  const diffMs = Math.max(0, end.getTime() - start.getTime());
  const diffDays = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1);

  switch ((rentalType || "daily").toLowerCase()) {
    case "hourly":
      return diffDays * 8;
    case "weekly":
      return Math.max(1, Math.ceil(diffDays / 7));
    case "monthly":
      return Math.max(1, Math.ceil(diffDays / 30));
    case "daily":
    default:
      return diffDays;
  }
}

export default function EquipmentDetailPage() {
  const params = useParams<{ id: string }>();
  const rawId = params?.id;
  const equipmentId = Array.isArray(rawId) ? rawId[0] : rawId;

  const todayStr = useMemo(() => getTodayDateInputValue(), []);

  const [item, setItem] = useState<EquipmentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!equipmentId) return;
    let active = true;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_BASE_URL}/api/equipment/${equipmentId}`, {
          cache: "no-store",
        });
        const data = await res.json();

        if (!res.ok || !data.success || !data.equipment) {
          throw new Error(data.message || "Failed to load equipment details.");
        }

        if (active) {
          const rawEq = data.equipment as EquipmentRecord;
          setItem({
            ...rawEq,
            _id: normalizeId(rawEq._id) || equipmentId,
            ownerId: normalizeId(rawEq.ownerId),
            createdAt: normalizeDateString(rawEq.createdAt),
            updatedAt: normalizeDateString(rawEq.updatedAt),
          });
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Failed to load equipment."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchDetail();
    return () => {
      active = false;
    };
  }, [equipmentId]);

  const handleStartDateChange = (nextStart: string) => {
    const safeStart = nextStart && nextStart < todayStr ? todayStr : nextStart;
    setStartDate(safeStart);
    if (endDate && safeStart && endDate < safeStart) {
      setEndDate(safeStart);
    }
  };

  const handleEndDateChange = (nextEnd: string) => {
    const minAllowed = startDate && startDate >= todayStr ? startDate : todayStr;
    const safeEnd = nextEnd && nextEnd < minAllowed ? minAllowed : nextEnd;
    setEndDate(safeEnd);
  };

  const units = useMemo(
    () => calculateRentalUnits(startDate, endDate, item?.rentalType),
    [startDate, endDate, item?.rentalType]
  );

  const safeQuantity = Math.min(
    Math.max(1, Number(quantity) || 1),
    Math.max(1, item?.availableQuantity || 1)
  );

  const totalPrice = useMemo(() => {
    if (!item) return 0;
    return Number(item.rentalPrice || 0) * units * safeQuantity;
  }, [item, units, safeQuantity]);

  const handlePayAndBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    if (!startDate || !endDate) {
      toast.error("Please select start and end dates.");
      return;
    }

    if (startDate < todayStr || endDate < startDate) {
      toast.error("Please choose present or future dates only.");
      return;
    }

    setSubmitting(true);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("rentsy_token") || localStorage.getItem("token")
          : null;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const resolvedId = normalizeId(item._id) || equipmentId;

      const res = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({
          equipmentId: resolvedId,
          equipmentName: item.equipmentName,
          ownerId: normalizeId(item.ownerId),
          ownerEmail: item.ownerEmail,
          startDate,
          endDate,
          quantity: safeQuantity,
          units,
          unitPrice: item.rentalPrice,
          totalPrice,
          paymentStatus: "paid",
          notes: notes.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message || "Payment or booking failed.");
        return;
      }

      toast.success(
        data.message || `Payment of $${totalPrice.toLocaleString()} confirmed!`
      );
      setNotes("");
    } catch {
      toast.error("Network error while processing payment & booking.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-6 w-6 animate-spin text-[#6e13f9]" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center dark:bg-slate-950 dark:text-white">
        <p className="text-base font-bold text-red-600 dark:text-red-400">
          {error || "Equipment not found."}
        </p>
        <Link
          href="/equipment"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#6e13f9] px-5 py-2.5 text-xs font-semibold text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Equipment</span>
        </Link>
      </div>
    );
  }

  const displayId = normalizeId(item._id) || equipmentId;

  return (
    <div className="min-h-screen w-full bg-slate-50 px-4 py-10 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/equipment"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#6e13f9] dark:text-slate-400 dark:hover:text-[#a66cff]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to All Equipment</span>
        </Link>

        <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Full Equipment Details */}
          <div className="space-y-6 lg:col-span-7">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="relative h-72 w-full sm:h-96">
                <Image
                  src={item.imageUrl || FALLBACK_IMAGE}
                  alt={item.equipmentName}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
                <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#6e13f9] px-3 py-1 text-xs font-bold text-white">
                    {item.category}
                  </span>
                  {item.status && (
                    <span className="rounded-full bg-slate-950/75 px-3 py-1 text-xs font-semibold capitalize text-white backdrop-blur-sm">
                      {item.status}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                      {item.equipmentName}
                    </h1>
                    <p className="mt-1 font-mono text-[11px] text-slate-400">
                      ID: {displayId}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-[#6e13f9] dark:text-[#a66cff]" />
                        {item.location || "Location on request"}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        Condition: {item.condition || "Excellent"}
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        Available: {item.availableQuantity} units
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-3xl font-extrabold text-[#6e13f9] dark:text-[#a66cff]">
                      ${Number(item.rentalPrice || 0).toLocaleString()}
                    </span>
                    <span className="block text-xs font-medium capitalize text-slate-500 dark:text-slate-400">
                      per {item.rentalType || "day"}
                    </span>
                  </div>
                </div>

                <p className="mt-6 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {item.description ||
                    "Heavy duty equipment ready for construction and site operations."}
                </p>

                {/* Specs Grid */}
                <div className="mt-6 grid grid-cols-2 gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs dark:border-slate-800 dark:bg-slate-800/60 sm:grid-cols-4">
                  <div>
                    <span className="text-slate-400">Brand</span>
                    <p className="mt-0.5 font-bold">{item.brand || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Model</span>
                    <p className="mt-0.5 font-bold">{item.model || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Condition</span>
                    <p className="mt-0.5 font-bold">
                      {item.condition || "Excellent"}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Rental Type</span>
                    <p className="mt-0.5 font-bold capitalize">
                      {item.rentalType || "daily"}
                    </p>
                  </div>
                </div>

                {/* Rental Terms */}
                {item.rentalTerms && (
                  <div className="mt-6 rounded-2xl border border-purple-200/70 bg-purple-50/60 p-4 dark:border-purple-900/40 dark:bg-purple-950/20">
                    <h2 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6e13f9] dark:text-[#b78aff]">
                      <ShieldCheck className="h-4 w-4" />
                      Rental Terms
                    </h2>
                    <p className="mt-1.5 text-xs leading-6 text-slate-700 dark:text-slate-300 sm:text-sm">
                      {item.rentalTerms}
                    </p>
                  </div>
                )}

                {/* Owner Information */}
                {(item.ownerName || item.ownerEmail || item.ownerPhone) && (
                  <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Equipment Owner Details
                    </h2>
                    <div className="mt-3 flex flex-wrap items-center gap-5 text-xs text-slate-700 dark:text-slate-300">
                      {item.ownerName && (
                        <span className="inline-flex items-center gap-1.5 font-semibold">
                          <User className="h-3.5 w-3.5 text-[#6e13f9]" />
                          {item.ownerName}
                        </span>
                      )}
                      {item.ownerPhone && (
                        <a
                          href={`tel:${item.ownerPhone}`}
                          className="inline-flex items-center gap-1.5 hover:text-[#6e13f9]"
                        >
                          <Phone className="h-3.5 w-3.5 text-[#6e13f9]" />
                          {item.ownerPhone}
                        </a>
                      )}
                      {item.ownerEmail && (
                        <a
                          href={`mailto:${item.ownerEmail}`}
                          className="inline-flex items-center gap-1.5 hover:text-[#6e13f9]"
                        >
                          <Mail className="h-3.5 w-3.5 text-[#6e13f9]" />
                          {item.ownerEmail}
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Date Picker (Present/Future Only) + Price + Pay Button */}
          <div className="lg:col-span-5">
            <div className="sticky top-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
              <h2 className="flex items-center gap-2 text-lg font-extrabold">
                <Calendar className="h-5 w-5 text-[#6e13f9] dark:text-[#a66cff]" />
                Book &amp; Pay Rental
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Select present or future dates (past dates are disabled).
              </p>

              <form onSubmit={handlePayAndBook} className="mt-5 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="startDate"
                      className="mb-1 block text-xs font-semibold"
                    >
                      Start Date
                    </label>
                    <input
                      id="startDate"
                      type="date"
                      min={todayStr}
                      required
                      value={startDate}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-[#6e13f9] dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="endDate"
                      className="mb-1 block text-xs font-semibold"
                    >
                      End Date
                    </label>
                    <input
                      id="endDate"
                      type="date"
                      min={startDate >= todayStr ? startDate : todayStr}
                      required
                      value={endDate}
                      onChange={(e) => handleEndDateChange(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-[#6e13f9] dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="quantity"
                    className="mb-1 block text-xs font-semibold"
                  >
                    Quantity (Max {Math.max(1, item.availableQuantity || 1)})
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    min={1}
                    max={Math.max(1, item.availableQuantity || 1)}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-[#6e13f9] dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label
                    htmlFor="notes"
                    className="mb-1 block text-xs font-semibold"
                  >
                    Project / Site Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Site address in Dhaka, delivery time, etc."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-[#6e13f9] dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                {/* Price Breakdown Box */}
                <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs dark:border-slate-800 dark:bg-slate-800/60">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>
                      Rate (${Number(item.rentalPrice || 0).toLocaleString()} ×{" "}
                      {units} {item.rentalType || "day"} unit{units > 1 ? "s" : ""})
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      $
                      {(
                        Number(item.rentalPrice || 0) * units
                      ).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>Quantity</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {safeQuantity}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200 pt-2.5 text-sm font-extrabold dark:border-slate-700">
                    <span>Total Payable</span>
                    <span className="text-lg text-[#6e13f9] dark:text-[#a66cff]">
                      ${totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || item.availableQuantity <= 0}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#6e13f9] py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#5b0ed6] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>
                    {submitting
                      ? "Processing Payment..."
                      : item.availableQuantity <= 0
                      ? "Out of Stock"
                      : `Pay $${totalPrice.toLocaleString()} & Book`}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}