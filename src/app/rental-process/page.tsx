import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  FileCheck2,
  MessageSquare,
  PackageCheck,
  RotateCcw,
  Search,
  Truck,
} from "lucide-react";

import { CtaPanel, PublicPage, SectionTitle } from "../components/public/PublicPage";

export const metadata: Metadata = {
  title: "Rental Process — rEntsy Equipment Rental",
  description:
    "A step-by-step guide to the rEntsy rental process, from booking to return.",
};

const timeline = [
  {
    icon: Search,
    title: "Choose equipment",
    description:
      "Compare listings by category, rental rate, location and availability. Open a listing to review specs and owner terms.",
    detail: "Before booking",
  },
  {
    icon: CalendarCheck,
    title: "Submit a request",
    description:
      "Select start and end dates, quantity, contact number and delivery address. The form shows the calculated total before you confirm.",
    detail: "Takes about 2 minutes",
  },
  {
    icon: CreditCard,
    title: "Complete checkout",
    description:
      "Confirm the rental and complete the secure checkout step. Payment status is recorded against the booking.",
    detail: "Secure checkout",
  },
  {
    icon: MessageSquare,
    title: "Owner confirmation",
    description:
      "The owner reviews the request and confirms availability. You can follow status changes from My Rentals.",
    detail: "Usually within 1 business day",
  },
  {
    icon: Truck,
    title: "Receive the equipment",
    description:
      "Coordinate delivery or pickup with the owner using the contact details in the booking. Inspect the equipment at handover.",
    detail: "On your rental start date",
  },
  {
    icon: RotateCcw,
    title: "Return and close",
    description:
      "Return the equipment in the agreed condition. The owner marks the rental complete and the booking is archived.",
    detail: "On or before the end date",
  },
];

const checklist = [
  "Government-issued ID for verification when requested.",
  "A delivery address that can accept the equipment size.",
  "The correct contact number for the rental window.",
  "Confirmation that the site can support the equipment.",
  "A plan for safe loading, operation and return.",
  "Photos of the equipment condition at handover.",
];

export default function RentalProcessPage() {
  return (
    <PublicPage
      eyebrow="Rental process"
      title="Know every step"
      highlight="before you book."
      description="From the first search to the final return, here is exactly how a rental moves through rEntsy."
      action={
        <Link
          href="/equipment"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6e13f9] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#6e13f9]/20 transition hover:bg-[#5b0ed6]"
        >
          Find equipment
          <ArrowRight className="h-4 w-4" />
        </Link>
      }
    >
      <section className="relative">
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-[27px] top-0 hidden w-px bg-slate-200 dark:bg-slate-800 sm:block"
        />

        <div className="space-y-4">
          {timeline.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="relative flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-start sm:gap-5 dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#6e13f9] text-white shadow-lg shadow-[#6e13f9]/25">
                  <Icon className="h-6 w-6" />
                </span>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Step {index + 1}
                    </span>
                    <span className="rounded-full bg-[#6e13f9]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#6e13f9] dark:bg-[#6e13f9]/20 dark:text-[#c4a4ff]">
                      {step.detail}
                    </span>
                  </div>
                  <h2 className="mt-1.5 text-base font-extrabold text-slate-900 dark:text-white">
                    {step.title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-7">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-[#6e13f9] dark:text-[#a66cff]" />
            <SectionTitle title="Before the handover" />
          </div>
          <ul className="mt-4 space-y-3">
            {checklist.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm leading-6 text-slate-600 dark:text-slate-400"
              >
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <FileCheck2 className="h-5 w-5 text-[#6e13f9] dark:text-[#a66cff]" />
            <h2 className="mt-3 text-base font-bold">Cancellations</h2>
            <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Customers can cancel while a booking is pending or confirmed.
              Refunds are reviewed against the owner&apos;s rental terms and the
              timing of the cancellation. Once a rental is ongoing, contact
              support to resolve the return.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/40 dark:bg-amber-950/20">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-300" />
              <div>
                <h2 className="text-base font-bold text-amber-900 dark:text-amber-200">
                  Damage and late returns
                </h2>
                <p className="mt-1.5 text-sm leading-6 text-amber-800/80 dark:text-amber-200/80">
                  Equipment should be returned in the condition it was received.
                  Late returns or damage are resolved between the renter, owner
                  and support, using the booking record and handover photos.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <PackageCheck className="h-5 w-5 text-[#6e13f9] dark:text-[#a66cff]" />
            <h2 className="mt-3 text-base font-bold">After the rental</h2>
            <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Completed rentals stay in your history with their payment and
              booking status. Owners can view earnings, and customers can rebook
              favorites in a few clicks.
            </p>
          </div>
        </div>
      </section>

      <CtaPanel
        title="Questions about your specific rental?"
        description="Our support team can walk you through dates, delivery, returns or a booking that needs attention."
        primaryHref="/contact"
        primaryLabel="Talk to support"
        secondaryHref="/faq"
        secondaryLabel="Read the FAQ"
      />
    </PublicPage>
  );
}
