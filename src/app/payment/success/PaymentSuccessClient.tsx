"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  LayoutDashboard,
  Loader2,
  Package,
  ShieldCheck,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { API_URL, getAccessToken } from "@/lib/api";
import { formatMoney, formatRentalDate } from "@/lib/rental";

type BookingRecord = {
  _id?: string;
  bookingId?: string;
  equipmentName?: string;
  rentalStartDate?: string;
  rentalEndDate?: string;
  requiredQuantity?: number;
  totalAmount?: number;
  paymentStatus?: string;
  bookingStatus?: string;
  transactionId?: string;
};

type VerifyResponse = {
  success?: boolean;
  message?: string;
  booking?: BookingRecord | null;
  payment?: {
    totalAmount?: number;
    paidAmount?: number;
    transactionId?: string;
  } | null;
};

type PageState = "checking" | "verifying" | "success" | "pending" | "error";

export default function PaymentSuccessClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sessionId = searchParams.get("session_id") || "";
  const checkoutId = searchParams.get("checkout") || "";

  const [state, setState] = useState<PageState>("checking");
  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [message, setMessage] = useState("");

  // React strict mode runs effects twice in development. Keep a ref so
  // the verification request is only sent once per page view.
  const verificationStarted = useRef(false);

  const verifyPayment = useCallback(async () => {
    if (!sessionId && !checkoutId) {
      setState("error");
      setMessage("No payment reference was found in this link.");
      return;
    }

    setState("verifying");
    setMessage("");

    try {
      // A signed-in session is required so the API can confirm the
      // payment belongs to this customer.
      const { data: session } = await authClient.getSession();

      if (!session?.user) {
        const currentUrl =
          typeof window !== "undefined"
            ? `${window.location.pathname}${window.location.search}`
            : "/payment/success";

        router.replace(`/sign-in?redirect=${encodeURIComponent(currentUrl)}`);
        return;
      }

      const token = await getAccessToken();

      const response = await fetch(`${API_URL}/payments/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(
          sessionId ? { sessionId } : { checkoutId }
        ),
      });

      const data = (await response.json().catch(() => ({}))) as VerifyResponse;

      if (response.status === 402) {
        setState("pending");
        setMessage(
          data.message ||
            "The payment is still processing. Refresh in a moment."
        );
        return;
      }

      if (!response.ok || data.success === false) {
        setState("error");
        setMessage(data.message || "We could not confirm this payment.");
        return;
      }

      setBooking(data.booking || null);
      setState("success");

      toast.success("Payment confirmed. Your booking is ready.");
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Network error while confirming the payment."
      );
    }
  }, [checkoutId, router, sessionId]);

  useEffect(() => {
    if (verificationStarted.current) return;
    verificationStarted.current = true;

    void verifyPayment();
  }, [verifyPayment]);

  if (state === "checking" || state === "verifying") {
    return (
      <div className="flex min-h-[75vh] w-full flex-col items-center justify-center bg-slate-50 px-4 text-center dark:bg-slate-950 dark:text-white">
        <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#6e13f9]/10 text-[#6e13f9] dark:bg-[#6e13f9]/20 dark:text-[#c4a4ff]">
          <Loader2 className="h-7 w-7 animate-spin" />
        </span>
        <h1 className="mt-5 text-xl font-extrabold tracking-tight sm:text-2xl">
          Confirming your payment
        </h1>
        <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
          Please keep this page open while Stripe confirms the transaction.
          This usually takes a few seconds.
        </p>

        <div className="mt-8 w-full max-w-md space-y-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="h-4 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800"
              style={{ width: `${90 - item * 15}%`, marginInline: "auto" }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (state === "pending") {
    return (
      <div className="flex min-h-[75vh] w-full flex-col items-center justify-center bg-slate-50 px-4 text-center dark:bg-slate-950 dark:text-white">
        <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300">
          <Clock3 className="h-7 w-7" />
        </span>
        <h1 className="mt-5 text-xl font-extrabold tracking-tight sm:text-2xl">
          Payment is processing
        </h1>
        <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
          {message}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => void verifyPayment()}
            className="inline-flex items-center gap-2 rounded-full bg-[#6e13f9] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#5b0ed6]"
          >
            <Loader2 className="h-3.5 w-3.5" />
            Check again
          </button>
          <Link
            href="/dashboard/rentals"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            My rentals
          </Link>
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="flex min-h-[75vh] w-full flex-col items-center justify-center bg-slate-50 px-4 text-center dark:bg-slate-950 dark:text-white">
        <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300">
          <CreditCard className="h-7 w-7" />
        </span>
        <h1 className="mt-5 text-xl font-extrabold tracking-tight sm:text-2xl">
          Could not confirm the payment
        </h1>
        <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
          {message}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => void verifyPayment()}
            className="inline-flex items-center gap-2 rounded-full bg-[#6e13f9] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#5b0ed6]"
          >
            Try again
          </button>
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

  const amount =
    booking?.totalAmount ?? 0;

  return (
    <div className="min-h-screen w-full bg-slate-50 px-4 py-12 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-xl shadow-emerald-100/40 dark:border-emerald-900/40 dark:bg-slate-900 dark:shadow-black/30">
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500" />

          <div className="p-6 text-center sm:p-9">
            <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
              <CheckCircle2 className="h-10 w-10" />
            </span>

            <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
              Payment confirmed
            </p>

            <h1 className="mt-1.5 text-2xl font-black tracking-tight sm:text-3xl">
              Your rental is booked
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-400">
              The payment was successful and your booking record has been
              created. The equipment owner has been notified and will confirm
              the rental shortly.
            </p>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left dark:border-slate-800 dark:bg-slate-800/50 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Booking reference
                </span>
                <span className="font-mono text-xs font-bold text-[#6e13f9] dark:text-[#a66cff]">
                  {booking?.bookingId || "—"}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <Package className="h-3.5 w-3.5" />
                    Equipment
                  </p>
                  <p className="mt-1 text-sm font-bold">
                    {booking?.equipmentName || "Rental equipment"}
                  </p>
                </div>

                <div>
                  <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Rental window
                  </p>
                  <p className="mt-1 text-sm font-bold">
                    {formatRentalDate(booking?.rentalStartDate)} →{" "}
                    {formatRentalDate(booking?.rentalEndDate)}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Quantity
                  </p>
                  <p className="mt-1 text-sm font-bold">
                    {booking?.requiredQuantity || 1} unit(s)
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Payment status
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                    <ShieldCheck className="h-3 w-3" />
                    Paid
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Total paid
                </span>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  {formatMoney(amount)}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <Link
                href="/dashboard/rentals"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#6e13f9] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#5b0ed6]"
              >
                <LayoutDashboard className="h-4 w-4" />
                View my rentals
              </Link>
              <Link
                href="/equipment"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Browse equipment
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <p className="mt-4 text-[10px] leading-5 text-slate-500 dark:text-slate-400">
              A confirmation is available in your dashboard. Keep your booking
              reference for any support requests.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
