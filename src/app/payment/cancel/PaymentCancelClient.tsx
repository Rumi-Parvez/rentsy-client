"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import {
  ArrowLeft,
  CreditCard,
  LayoutDashboard,
  RotateCcw,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { API_URL, getAccessToken } from "@/lib/api";

export default function PaymentCancelClient() {
  const searchParams = useSearchParams();

  const checkoutId = searchParams.get("checkout") || "";
  const equipmentId = searchParams.get("equipmentId") || "";

  const cancelRequested = useRef(false);

  // Mark the pending checkout as cancelled so abandoned payment records
  // do not stay "pending" forever. Failures are intentionally ignored:
  // the page must still show the cancellation UI.
  useEffect(() => {
    if (!checkoutId || cancelRequested.current) return;

    cancelRequested.current = true;

    const cancelCheckout = async () => {
      try {
        const { data: session } = await authClient.getSession();

        if (!session?.user) return;

        const token = await getAccessToken();

        await fetch(`${API_URL}/payments/cancel`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ checkoutId }),
        });
      } catch {
        // Nothing to do: the customer already sees the cancel screen.
      }
    };

    void cancelCheckout();
  }, [checkoutId]);

  return (
    <div className="flex min-h-[75vh] w-full items-center justify-center bg-slate-50 px-4 py-12 text-slate-900 dark:bg-slate-950 dark:text-white sm:px-6 lg:px-8">
      <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-xl shadow-amber-100/40 dark:border-amber-900/40 dark:bg-slate-900 dark:shadow-black/30">
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400" />

        <div className="p-6 text-center sm:p-9">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300">
            <XCircle className="h-10 w-10" />
          </span>

          <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-400">
            Payment cancelled
          </p>

          <h1 className="mt-1.5 text-2xl font-black tracking-tight sm:text-3xl">
            No payment was taken
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-400">
            You left the secure checkout before completing the payment. Your
            card was not charged and no booking was created for this attempt.
          </p>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left dark:border-slate-800 dark:bg-slate-800/50">
            <p className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Nothing was charged
            </p>
            <p className="mt-1.5 text-[11px] leading-5 text-slate-500 dark:text-slate-400">
              You can return to the equipment page and start the checkout again
              whenever you are ready. Your selected rental dates can be chosen
              again on the booking form.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <Link
              href={equipmentId ? `/equipment/${equipmentId}` : "/equipment"}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#6e13f9] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#5b0ed6]"
            >
              <RotateCcw className="h-4 w-4" />
              Try again
            </Link>

            <Link
              href="/dashboard/rentals"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <LayoutDashboard className="h-4 w-4" />
              My rentals
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
            <Link
              href="/equipment"
              className="inline-flex items-center gap-1.5 font-semibold hover:text-[#6e13f9] dark:hover:text-[#a66cff]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Browse equipment
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 font-semibold hover:text-[#6e13f9] dark:hover:text-[#a66cff]"
            >
              <CreditCard className="h-3.5 w-3.5" />
              Payment help
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
