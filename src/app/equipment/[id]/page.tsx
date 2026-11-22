"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Image from "@/components/ImageWithFallback";

import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  CreditCard,
  Heart,
  Mail,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { API_URL, getAccessToken } from "@/lib/api";
import {
  calculateRentalUnits,
  getTodayDateInputValue,
} from "@/lib/rental";

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

export default function EquipmentDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const rawId = params?.id;
  const equipmentId = Array.isArray(rawId) ? rawId[0] : rawId;

  const todayStr = useMemo(() => getTodayDateInputValue(), []);

  const [item, setItem] = useState<EquipmentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Session & favorites state
  const [userRole, setUserRole] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  // Booking Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [quantity, setQuantity] = useState(1);
  const [contactNumber, setContactNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isCustomer = userRole === "customer";

  // Load the signed-in user's role from the database (via the API) and
  // check whether this equipment is already saved in their favorites.
  useEffect(() => {
    if (!equipmentId) return;
    let active = true;

    const loadSession = async () => {
      try {
        const { data: session } = await authClient.getSession();

        if (!session?.user) {
          if (active) {
            setSignedIn(false);
            setUserRole("");
            setIsFavorite(false);
          }
          return;
        }

        if (active) {
          setSignedIn(true);
        }

        const token = await getAccessToken();

        const [meRes, favRes] = await Promise.all([
          fetch(`${API_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }),
          fetch(`${API_URL}/favorites`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }),
        ]);

        if (meRes.ok) {
          const meData = await meRes.json();
          const role = String(meData?.user?.role || "").toLowerCase();
          if (active && role) {
            setUserRole(role);
          }
        }

        if (favRes.ok) {
          const favData = await favRes.json();
          const list: Array<Record<string, unknown>> = Array.isArray(
            favData?.favorites
          )
            ? favData.favorites
            : [];

          const matched = list.some((entry) => {
            const entryEqId = normalizeId(
              (entry?.equipmentId as MongoObjectId) ||
                (entry?.equipment as { _id?: MongoObjectId })?._id
            );
            return entryEqId === equipmentId;
          });

          if (active) {
            setIsFavorite(matched);
          }
        }
      } catch {
        // A missing or expired session simply hides account-only actions.
        if (active) {
          setSignedIn(false);
          setUserRole("");
        }
      } finally {
        if (active) {
          setSessionChecked(true);
        }
      }
    };

    void loadSession();
    return () => {
      active = false;
    };
  }, [equipmentId]);

  // Equipment details are a private route: visitors are sent to sign in
  // and returned to this listing after authentication.
  useEffect(() => {
    if (!sessionChecked || signedIn || !equipmentId) return;

    const timer = window.setTimeout(() => {
      router.replace(
        `/sign-in?redirect=${encodeURIComponent(`/equipment/${equipmentId}`)}`
      );
    }, 0);

    return () => window.clearTimeout(timer);
  }, [sessionChecked, signedIn, equipmentId, router]);

  // Load equipment item
  useEffect(() => {
    if (!equipmentId) return;
    let active = true;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError("");

        const token = await getAccessToken();
        const res = await fetch(`${API_URL}/equipment/${equipmentId}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
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

  // POST /api/favorites when unsaved, DELETE /api/favorites/:equipmentId when saved.
  const handleToggleFavorite = async () => {
    if (!item) return;

    const resolvedId = normalizeId(item._id) || equipmentId;
    if (!resolvedId) return;

    if (!signedIn) {
      toast.error("Please sign in to save favorites.");
      router.push(
        `/sign-in?redirect=${encodeURIComponent(`/equipment/${resolvedId}`)}`
      );
      return;
    }

    setFavoriteLoading(true);

    try {
      const token = await getAccessToken();
      const endpoint = isFavorite
        ? `${API_URL}/favorites/${resolvedId}`
        : `${API_URL}/favorites`;

      const res = await fetch(endpoint, {
        method: isFavorite ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: isFavorite
          ? undefined
          : JSON.stringify({ equipmentId: resolvedId }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.success === false) {
        toast.error(
          data.message ||
            (isFavorite
              ? "Failed to remove from favorites."
              : "Failed to add to favorites.")
        );
        return;
      }

      setIsFavorite((previous) => !previous);
      toast.success(
        data.message ||
          (isFavorite
            ? "Removed from favorites."
            : "Equipment added to favorites!")
      );
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Network error while updating favorites."
      );
    } finally {
      setFavoriteLoading(false);
    }
  };

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

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    if (!signedIn) {
      toast.error("Please sign in to book this equipment.");
      router.push(
        `/sign-in?redirect=${encodeURIComponent(`/equipment/${equipmentId}`)}`
      );
      return;
    }

    if (!startDate || !endDate) {
      toast.error("Please select start and end dates.");
      return;
    }

    if (startDate < todayStr || endDate < startDate) {
      toast.error("Past dates are not allowed. Choose today or a future date.");
      return;
    }

    if (safeQuantity > (item.availableQuantity || 0)) {
      toast.error("Requested quantity exceeds available equipment stock.");
      return;
    }

    if (!contactNumber.trim() || !deliveryAddress.trim()) {
      toast.error("Please enter your contact number and delivery address.");
      return;
    }

    setSubmitting(true);

    try {
      const resolvedId = normalizeId(item._id) || equipmentId;

      // Keep the customer's delivery details for the checkout page.
      // They are short-lived, per-tab values, not permanent storage.
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(
          "rentsy_checkout_draft",
          JSON.stringify({
            equipmentId: resolvedId,
            contactNumber: contactNumber.trim(),
            deliveryAddress: deliveryAddress.trim(),
            additionalNotes: notes.trim(),
          })
        );
      }

      setIsModalOpen(false);

      router.push(
        `/checkout?equipmentId=${encodeURIComponent(
          resolvedId
        )}&start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(
          endDate
        )}&qty=${safeQuantity}`
      );
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Could not open the checkout page."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !sessionChecked || !signedIn) {
    return (
      <div className="min-h-screen w-full bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="h-3 w-36 rounded-full bg-slate-200 dark:bg-slate-800" />

          <div className="mt-5 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-7">
              <div className="h-72 w-full rounded-3xl bg-slate-200 dark:bg-slate-800 sm:h-96" />

              <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
                <div className="h-7 w-2/3 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="mt-4 h-3 w-44 rounded-full bg-slate-200 dark:bg-slate-800" />

                <div className="mt-7 space-y-3">
                  <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-800" />
                  <div className="h-3 w-11/12 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <div className="h-3 w-4/6 rounded-full bg-slate-200 dark:bg-slate-800" />
                </div>

                <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[0, 1, 2, 3].map((key) => (
                    <div
                      key={key}
                      className="h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/60"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <div className="h-5 w-48 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="mt-3 h-3 w-full rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="mt-6 h-32 rounded-2xl bg-slate-100 dark:bg-slate-800/60" />
                <div className="mt-5 h-12 rounded-xl bg-slate-200 dark:bg-slate-800" />
                <div className="mt-3 h-10 rounded-xl bg-slate-100 dark:bg-slate-800/60" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center dark:bg-slate-950 dark:text-white">
        <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300">
          <X className="h-7 w-7" />
        </span>
        <h1 className="mt-5 text-xl font-extrabold tracking-tight sm:text-2xl">
          Equipment unavailable
        </h1>
        <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
          {error || "We could not find this equipment listing."}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/equipment"
            className="inline-flex items-center gap-2 rounded-full bg-[#6e13f9] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#5b0ed6]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Equipment</span>
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Contact Support</span>
          </Link>
        </div>
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
                  fallbackIcon={Package}
                  className="object-cover"
                />
                <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#6e13f9] px-3 py-1 text-xs font-bold text-white">
                    {item.category}
                  </span>
                  
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                      {item.equipmentName}
                    </h1>
                    

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

                {/* Favorite Button (POST /api/favorites & DELETE /api/favorites/:equipmentId) */}
                {(isCustomer || !userRole) && (
                  <div className="mt-5">
                    <button
                      type="button"
                      disabled={favoriteLoading}
                      onClick={() => void handleToggleFavorite()}
                      aria-pressed={isFavorite}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition ${
                        isFavorite
                          ? "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-[#6e13f9] hover:text-[#6e13f9] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      }`}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          isFavorite ? "fill-rose-500 text-rose-500" : ""
                        }`}
                      />
                      <span>
                        {favoriteLoading
                          ? isFavorite
                            ? "Removing..."
                            : "Saving..."
                          : isFavorite
                          ? "Saved in Favorites (Click to Remove)"
                          : "Add to Favorites"}
                      </span>
                    </button>
                  </div>
                )}

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
                      Rental Terms and Conditions
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
                      Equipment Owner Information
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

          {/* Right Column: Summary + Book Now & Favorite Buttons */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
              <h2 className="flex items-center gap-2 text-lg font-extrabold">
                <Calendar className="h-5 w-5 text-[#6e13f9] dark:text-[#a66cff]" />
                Rental Reservation
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Open the booking form to choose dates and delivery details.
                Continue to the secure payment step to confirm the rental.
              </p>

              <div className="mt-5 space-y-2.5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs dark:border-slate-800 dark:bg-slate-800/60">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">
                    Rental Rate
                  </span>
                  <span className="font-bold">
                    ${Number(item.rentalPrice || 0).toLocaleString()} /{" "}
                    {item.rentalType || "daily"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">
                    Available Stock
                  </span>
                  <span className="font-bold">
                    {item.availableQuantity} units
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">
                    Location
                  </span>
                  <span className="font-bold">{item.location || "N/A"}</span>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2.5">
                <button
                  type="button"
                  disabled={item.availableQuantity <= 0}
                  onClick={() => {
                    if (!signedIn) {
                      toast.error("Please sign in to book this equipment.");
                      router.push(
                        `/sign-in?redirect=${encodeURIComponent(
                          `/equipment/${equipmentId}`
                        )}`
                      );
                      return;
                    }

                    setIsModalOpen(true);
                  }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#6e13f9] py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#5b0ed6] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>
                    {item.availableQuantity <= 0
                      ? "Currently Unavailable"
                      : "Book Now"}
                  </span>
                </button>

                <button
                  type="button"
                  disabled={favoriteLoading}
                  onClick={() => void handleToggleFavorite()}
                  aria-pressed={isFavorite}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-bold transition ${
                    isFavorite
                      ? "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-[#6e13f9] hover:text-[#6e13f9] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isFavorite ? "fill-rose-500 text-rose-500" : ""
                    }`}
                  />
                  <span>
                    {favoriteLoading
                      ? isFavorite
                        ? "Removing..."
                        : "Saving..."
                      : isFavorite
                      ? "Saved in Favorites (Remove)"
                      : "Add to Favorite"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal — No Scrollbar, Clear Below Navbar */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-modal-title"
          className="fixed inset-0 z-[120] flex items-center justify-center overflow-hidden bg-slate-950/65 px-4 pt-16 pb-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 text-slate-900 shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:text-white sm:p-6">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="min-w-0">
                <h2
                  id="booking-modal-title"
                  className="truncate text-base font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-lg"
                >
                  Book {item.equipmentName}
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Past dates are disabled. Continue to payment to confirm the
                  rental; the owner is notified once payment succeeds.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close booking modal"
                className="shrink-0 rounded-full p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleConfirmBooking}
              className="mt-3.5 space-y-3"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="modalStartDate"
                    className="mb-1 block text-[11px] font-semibold"
                  >
                    Rental Start Date *
                  </label>
                  <input
                    id="modalStartDate"
                    type="date"
                    min={todayStr}
                    required
                    value={startDate}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-[#6e13f9] dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label
                    htmlFor="modalEndDate"
                    className="mb-1 block text-[11px] font-semibold"
                  >
                    Rental End Date *
                  </label>
                  <input
                    id="modalEndDate"
                    type="date"
                    min={startDate >= todayStr ? startDate : todayStr}
                    required
                    value={endDate}
                    onChange={(e) => handleEndDateChange(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-[#6e13f9] dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label
                    htmlFor="modalQuantity"
                    className="mb-1 block text-[11px] font-semibold"
                  >
                    Quantity (Max{" "}
                    {Math.max(1, item.availableQuantity || 1)}) *
                  </label>
                  <input
                    id="modalQuantity"
                    type="number"
                    min={1}
                    max={Math.max(1, item.availableQuantity || 1)}
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-[#6e13f9] dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="modalContact"
                    className="mb-1 block text-[11px] font-semibold"
                  >
                    Contact Number *
                  </label>
                  <input
                    id="modalContact"
                    type="tel"
                    required
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="+8801XXXXXXXXX"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-[#6e13f9] dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label
                    htmlFor="modalAddress"
                    className="mb-1 block text-[11px] font-semibold"
                  >
                    Delivery Address *
                  </label>
                  <input
                    id="modalAddress"
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Street, area, city"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-[#6e13f9] dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="modalNotes"
                  className="mb-1 block text-[11px] font-semibold"
                >
                  Additional Notes (Optional)
                </label>
                <input
                  id="modalNotes"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Delivery instructions or site notes..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-[#6e13f9] dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              {/* Calculated Total */}
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs dark:border-slate-800 dark:bg-slate-800/60">
                <span className="text-slate-600 dark:text-slate-400">
                  {units} {item.rentalType || "day"} unit{units > 1 ? "s" : ""}{" "}
                  × {safeQuantity} qty ($
                  {Number(item.rentalPrice || 0).toLocaleString()} each)
                </span>
                <div className="text-right">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Total Amount
                  </span>
                  <span className="text-base font-extrabold text-[#6e13f9] dark:text-[#a66cff]">
                    ${totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#6e13f9] px-5 py-2 text-xs font-bold text-white shadow-md transition hover:bg-[#5b0ed6] disabled:opacity-60"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>
                    {submitting
                      ? "Starting Secure Checkout..."
                      : "Continue to Payment"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
