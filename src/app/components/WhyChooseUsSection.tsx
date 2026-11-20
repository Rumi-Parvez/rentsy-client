"use client";

import React from "react";
import Link from "next/link";

import {
  ArrowRight,
  BadgeDollarSign,
  CalendarRange,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";

type BenefitItem = {
  title: string;
  description: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
};

const PLATFORM_BENEFITS: BenefitItem[] = [
  {
    title: "Affordable Rental Prices",
    description:
      "Compare transparent rates directly from local owners without hidden markups, keeping project and jobsite budgets predictable.",
    badge: "Transparent Rates",
    icon: BadgeDollarSign,
  },
  {
    title: "Verified Equipment Owners",
    description:
      "Rent with confidence from reviewed owners and approved fleet listings with clear condition notes, specs, and availability.",
    badge: "Trusted Fleet",
    icon: ShieldCheck,
  },
  {
    title: "Flexible Rental Periods",
    description:
      "Book on your timeline with hourly, daily, weekly, and monthly billing options tailored to short tasks or multi-week builds.",
    badge: "Hourly to Monthly",
    icon: CalendarRange,
  },
  {
    title: "Secure Payments",
    description:
      "Calculate totals upfront by rental duration and quantity, complete payments safely, and track every booking in one place.",
    badge: "Protected Checkout",
    icon: WalletCards,
  },
];

export default function WhyChooseUsSection() {
  return (
    <section
      id="why-choose-us"
      className="w-full border-t border-slate-200/80 bg-white px-4 py-16 text-slate-900 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950 dark:text-white sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#6e13f9]/20 bg-[#6e13f9]/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#6e13f9] dark:border-[#a66cff]/25 dark:text-[#b78aff]">
             
              <span>Why Choose rEntsy</span>
            </div>

            <h2 className="text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
              Built for reliable{" "}
              <span className="text-[#6e13f9] dark:text-[#a66cff]">
                equipment rentals.
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
              Whether you are running a jobsite, managing logistics, or
              producing an event, rEntsy makes finding and booking the right
              gear straightforward.
            </p>
          </div>

          <Link
            href="/equipment"
            className="group inline-flex w-fit items-center gap-2 rounded-full bg-[#6e13f9] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5b0ed6]"
          >
            <span>Browse Equipment</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 4 Core Benefits Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PLATFORM_BENEFITS.map((benefit) => {
            const IconComponent = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-slate-50/70 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#6e13f9]/50 hover:bg-white hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/70 dark:hover:bg-slate-900"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6e13f9]/10 text-[#6e13f9] transition-colors duration-300 group-hover:bg-[#6e13f9] group-hover:text-white dark:bg-[#a66cff]/15 dark:text-[#a66cff] dark:group-hover:bg-[#6e13f9] dark:group-hover:text-white">
                      <IconComponent className="h-6 w-6" />
                    </div>

                    <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {benefit.badge}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {benefit.title}
                  </h3>

                  <p className="mt-2.5 text-xs leading-6 text-slate-600 dark:text-slate-400 sm:text-sm">
                    {benefit.description}
                  </p>
                </div>

                <div className="mt-6 h-1 w-12 rounded-full bg-[#6e13f9]/30 transition-all duration-300 group-hover:w-full group-hover:bg-[#6e13f9]" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}