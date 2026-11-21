"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Loader2,
  Lock,
  MapPin,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  User,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { API_URL, getAccessToken } from "@/lib/api";
import {
  calculateRentalUnits,
  formatMoney,
  formatRentalDate,
} from "@/lib/rental";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1503708928676-1cb796a0891e?auto=format&fit=crop&w=900&q=80";

type EquipmentRecord = {
  _id?: string;
  equipmentName?: string;
  category?: string;
  location?: string;
  rentalPrice?: number;
  rentalType?: string;
  availableQuantity?: number;
  imageUrl?: string;
  ownerName?: string;
  ownerEmail?: string;
  status?: string;
};

type PaymentResponse = {
  success?: boolean;
  message?: string;
  mode?: "stripe" | "demo";
  url?: string;
  redirectUrl?: string;
};

export default function CheckoutClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const equipmentId = searchParams.get("equipmentId") || "";
  const startDate = searchParams.get("start") || "";
  const endDate = searchParams.get("end") || "";
  const requestedQuantity = Math.max(
    1,
    Number(searchParams.get("qty") || 1) || 1
  );

  const [equipment, setEquipment] = useState<EquipmentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [signedIn, setSignedIn] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  const [quantity, setQuantity] = useState(requestedQuantity);
  const [contactNumber, setContactNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");

  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  const availableQuantity = Math.max(
    1,
    Number(equipment?.availableQuantity || 1)
  );

  const safeQuantity = Math.min(
    Math.max(1, Math.floor(quantity) || 1),
    availableQuantity
  );

  const datesValid =
    Boolean(startDate && endDate) && endDate >= startDate;

  const units = useMemo(
    () =>
      calculateRentalUnits(startDate, endDate, equipment?.rentalType),
    [startDate, endDate, equipment?.rentalType]
  );

  const pricePerUnit = Number(equipment?.rentalPrice || 0);
  const totalAmount = pricePerUnit * units * safeQuantity;
  const rentalType = String(equipment?.rentalType || "daily").toLowerCase();

  // Private page: send signed-out visitors to sign in and return them
  // to this exact checkout URL afterwards.
  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      try {
        const { data } = await authClient.getSession();

        if (!data?.user) {
          const currentPath =
            typeof window !== "undefined"
              ? `${window.location.pathname}${window.location.search}`
              : "/checkout";

          router.replace(
            `/sign-in?redirect=${encodeURIComponent(currentPath)}`
          );
          return;
        }

        if (active) setSignedIn(true);
      } catch {
        const currentPath =
          typeof window !== "undefined"
            ? `${window.location.pathname}${window.location.search}`
            : "/checkout";

        router.replace(
          `/sign-in?redirect=${encodeURIComponent(currentPath)}`
        );
      } finally {
        if (active) setSessionChecked(true);
      }
    };

    void checkSession();

    return () => {
      active = false;
    };
  }, [router]);

  // Load the equipment price from the server. The server recalculates
  // this amount again before creating the Stripe session.
  useEffect(() => {
    if (!equipmentId) {
      setLoading(false);
      setLoadError("No equipment was selected for checkout.");
      return;
    }

    let active = true;

    const loadEquipment = async () => {
      try {
        setLoading(true);
        setLoadError("");

        const response = await fetch(
          `${API_URL}/equipment/${equipmentId}`,
          { cache: "no-store" }
        );
        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data.success || !data.equipment) {
          throw new Error(
            data.message || "Failed to load equipment details."
          );
        }

        if (active) {
          setEquipment(data.equipment as EquipmentRecord);
        }
      } catch (error) {
        if (active) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Failed to load equipment details."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadEquipment();

    return () => {
      active = false;
    };
  }, [equipmentId]);

  // The booking modal stores the customer's delivery details for this
  // tab so the checkout form starts pre-filled.
  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem("rentsy_checkout_draft");

      if (!raw) return;

      const draft = JSON.parse(raw) as {
        equipmentId?: string;
        contactNumber?: string;
        deliveryAddress?: string;
        additionalNotes?: string;
      };

      if (draft.equipmentId !== equipmentId) return;

      setContactNumber(draft.contactNumber || "");
      setDeliveryAddress(draft.deliveryAddress || "");
      setNotes(draft.additionalNotes || "");
    } catch {
      // A missing or malformed draft is not an error; the customer can
      // simply type their details.
    }
  }, [equipmentId]);

  const handlePay = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!equipment || !datesValid) return;

    if (!contactNumber.trim() || !deliveryAddress.trim()) {
      toast.error("Please enter your contact number and delivery address.");
      return;
    }

    if (safeQuantity > availableQuantity) {
      toast.error("Requested quantity exceeds the available stock.");
      return;
    }

    setPaying(true);
    setPayError("");

    try {
      const token = await getAccessToken();

      const response = await fetch(`${API_URL}/payments/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          equipmentId,
          rentalStartDate: startDate,
          rentalEndDate: endDate,
          requiredQuantity: safeQuantity,
          contactNumber: contactNumber.trim(),
          deliveryAddress: deliveryAddress.trim(),
          additionalNotes: notes.trim(),
        }),
      });

      const data = (await response
        .json()
        .catch(() => ({}))) as PaymentResponse;

      if (!response.ok || data.success === false) {
        const message = data.message || "Could not start the payment.";
        setPayError(message);
        toast.error(message);
        return;
      }

      if (typeof data.url === "string" && data.url.startsWith("http")) {
        toast.success("Redirecting to secure Stripe checkout...");
        window.location.assign(data.url);
        return;
      }

      if (typeof data.redirectUrl === "string") {
        toast.success("Demo payment ready.");
        router.push(data.redirectUrl);
        return;
      }

      const message = "The payment provider did not return a checkout link.";
      setPayError(message);
      toast.error(message);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Network error while starting the payment.";
      setPayError(message);
      toast.error(message);
    } finally {
      setPaying(false);
    }
  };

  if (loading || !sessionChecked || !signedIn) {
    return (
      <div className="min-h-screen w-full bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="h-3 w-36 rounded-full bg-slate-200 dark:bg-slate-800" />

          <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-5 lg:col-span-7">
              <div className="h-80 rounded-3xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-40 rounded-3xl bg-slate-200 dark:bg-slate-800" />
            </div>

            <div className="lg:col-span-5">
              <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <div className="h-5 w-40 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800/60" />
                <div className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800/60" />
                <div className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800/60" />
                <div className="h-14 rounded-xl bg-slate-200 dark:bg-slate-800" />
                <div className="h-12 rounded-xl bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loadError || !equipment) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center dark:bg-slate-950 dark:text-white">
        <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300">
          <Package className="h-7 w-7" />
        </span>
        <h1 className="mt-5 text-xl font-extrabold tracking-tight sm:text-2xl">
          Checkout unavailable
        </h1>
        <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
          {loadError || "We could not load this equipment listing."}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/equipment"
            className="inline-flex items-center gap-2 rounded-full bg-[#6e13f9] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#5b0ed6]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to equipment
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Contact support
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 px-4 py-10 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href={`/equipment/${equipmentId}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#6e13f9] dark:text-slate-400 dark:hover:text-[#a66cff]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to equipment details
        </Link>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Secure checkout
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Review the rental total and confirm your delivery details.
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            Encrypted payment
          </span>
        </div>

        <form
          onSubmit={handlePay}
          className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12"
        >
          {/* Order summary */}
          <div className="space-y-5 lg:col-span-7">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="relative h-56 w-full sm:h-64">
                <Image
                  src={equipment.imageUrl || FALLBACK_IMAGE}
                  alt={equipment.equipmentName || "Rental equipment"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-2 text-white">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-purple-200">
                      {equipment.category || "Equipment"}
                    </p>
                    <h2 className="text-lg font-extrabold tracking-tight sm:text-xl">
                      {equipment.equipmentName}
                    </h2>
                  </div>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold capitalize backdrop-blur-sm">
                    {rentalType}
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <CalendarDays className="h-3.5 w-3.5" />
                      Rental window
                    </p>
                    <p className="mt-1.5 text-sm font-bold">
                      {formatRentalDate(startDate)} → {formatRentalDate(endDate)}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                      {units} billable {rentalType} unit{units > 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <MapPin className="h-3.5 w-3.5" />
                      Location
                    </p>
                    <p className="mt-1.5 text-sm font-bold">
                      {equipment.location || "Location on request"}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                      {availableQuantity} unit(s) in stock
                    </p>
                  </div>
                </div>

                {equipment.ownerName && (
                  <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <User className="h-3.5 w-3.5 text-[#6e13f9] dark:text-[#a66cff]" />
                    Listed by{" "}
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {equipment.ownerName}
                    </span>
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
              <h2 className="flex items-center gap-2 text-base font-extrabold">
                <Package className="h-4 w-4 text-[#6e13f9] dark:text-[#a66cff]" />
                Quantity
              </h2>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    disabled={safeQuantity <= 1}
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                    aria-label="Decrease quantity"
                    className="flex h-10 w-10 items-center justify-center rounded-l-xl text-slate-600 transition hover:bg-slate-100 disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <Minus className="h-4 w-4" />
                  </button>

                  <input
                    type="number"
                    min={1}
                    max={availableQuantity}
                    value={safeQuantity}
                    onChange={(event) =>
                      setQuantity(Number(event.target.value) || 1)
                    }
                    aria-label="Rental quantity"
                    className="h-10 w-14 border-x border-slate-200 bg-transparent text-center text-sm font-bold outline-none dark:border-slate-700"
                  />

                  <button
                    type="button"
                    disabled={safeQuantity >= availableQuantity}
                    onClick={() =>
                      setQuantity((value) =>
                        Math.min(availableQuantity, value + 1)
                      )
                    }
                    aria-label="Increase quantity"
                    className="flex h-10 w-10 items-center justify-center rounded-r-xl text-slate-600 transition hover:bg-slate-100 disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Maximum {availableQuantity} unit(s) for these dates.
                </p>
              </div>
            </div>
          </div>

          {/* Payment card */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
              <h2 className="text-base font-extrabold">Price summary</h2>

              <div className="mt-4 space-y-2.5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs dark:border-slate-800 dark:bg-slate-800/50">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">
                    Rate
                  </span>
                  <span className="font-bold">
                    {formatMoney(pricePerUnit)} / {rentalType}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">
                    Billable units
                  </span>
                  <span className="font-bold">{units}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">
                    Quantity
                  </span>
                  <span className="font-bold">{safeQuantity}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-2.5 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">
                    Total
                  </span>
                  <span className="text-lg font-black text-[#6e13f9] dark:text-[#a66cff]">
                    {formatMoney(totalAmount)}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <label
                    htmlFor="checkout-contact"
                    className="mb-1 block text-[11px] font-semibold"
                  >
                    Contact Number *
                  </label>
                  <input
                    id="checkout-contact"
                    type="tel"
                    required
                    value={contactNumber}
                    onChange={(event) => setContactNumber(event.target.value)}
                    placeholder="+8801XXXXXXXXX"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs outline-none transition focus:border-[#6e13f9] focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-800"
                  />
                </div>

                <div>
                  <label
                    htmlFor="checkout-address"
                    className="mb-1 block text-[11px] font-semibold"
                  >
                    Delivery Address *
                  </label>
                  <input
                    id="checkout-address"
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(event) => setDeliveryAddress(event.target.value)}
                    placeholder="Street, area, city"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs outline-none transition focus:border-[#6e13f9] focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-800"
                  />
                </div>

                <div>
                  <label
                    htmlFor="checkout-notes"
                    className="mb-1 block text-[11px] font-semibold"
                  >
                    Additional Notes (Optional)
                  </label>
                  <input
                    id="checkout-notes"
                    type="text"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Delivery instructions or site notes..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs outline-none transition focus:border-[#6e13f9] focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-800"
                  />
                </div>
              </div>

              {!datesValid && (
                <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-[11px] font-semibold text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">
                  The selected rental dates are not valid. Go back to the
                  equipment page and choose the dates again.
                </p>
              )}

              {payError && (
                <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-[11px] font-semibold text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">
                  {payError}
                </p>
              )}

              <button
                type="submit"
                disabled={paying || !datesValid || totalAmount <= 0}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#6e13f9] py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#5b0ed6] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {paying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Starting secure payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    Pay {formatMoney(totalAmount)}
                  </>
                )}
              </button>

              <p className="mt-3 flex items-start gap-1.5 text-[10px] leading-5 text-slate-500 dark:text-slate-400">
                <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                Payments are processed by Stripe. Your card details are never
                stored on rEntsy servers.
              </p>

              <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-[10px] leading-5 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                Your booking is created automatically after payment succeeds.
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
