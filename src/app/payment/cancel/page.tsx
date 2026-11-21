import type { Metadata } from "next";
import { Suspense } from "react";

import PaymentCancelClient from "./PaymentCancelClient";

export const metadata: Metadata = {
  title: "Payment Cancelled — rEntsy",
  description:
    "Your checkout was cancelled and no payment was taken. Return to the equipment page to try again.",
};

export const dynamic = "force-dynamic";

export default function PaymentCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#6e13f9]/25 border-t-[#6e13f9]" />
        </div>
      }
    >
      <PaymentCancelClient />
    </Suspense>
  );
}
