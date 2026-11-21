import type { Metadata } from "next";
import { Suspense } from "react";

import PaymentSuccessClient from "./PaymentSuccessClient";

export const metadata: Metadata = {
  title: "Payment Successful — rEntsy",
  description:
    "Your equipment rental payment is confirmed. Review your booking details.",
};

export const dynamic = "force-dynamic";

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#6e13f9]/25 border-t-[#6e13f9]" />
        </div>
      }
    >
      <PaymentSuccessClient />
    </Suspense>
  );
}
