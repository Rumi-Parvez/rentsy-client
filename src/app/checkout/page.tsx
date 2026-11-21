import type { Metadata } from "next";
import { Suspense } from "react";

import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Secure Checkout — rEntsy",
  description:
    "Review your rental dates and total, then pay securely to confirm your equipment booking.",
};

export const dynamic = "force-dynamic";

function CheckoutFallback() {
  return (
    <div className="min-h-screen w-full bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl animate-pulse">
        <div className="h-3 w-40 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="h-[420px] rounded-3xl bg-slate-200 dark:bg-slate-800 lg:col-span-7" />
          <div className="h-[420px] rounded-3xl bg-slate-200 dark:bg-slate-800 lg:col-span-5" />
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutFallback />}>
      <CheckoutClient />
    </Suspense>
  );
}
