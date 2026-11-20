"use client";

import Link from "next/link";

import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck2,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  FileCheck2,
  PackageCheck,
  Search,
  ShieldCheck,
  Truck,
  UserRoundPlus,
} from "lucide-react";

const renterSteps = [
  {
    number: "01",
    icon: Search,
    title: "Find the right equipment",
    description:
      "Browse verified equipment by category, location, availability, and rental price to find what your project needs.",
  },
  {
    number: "02",
    icon: CalendarCheck2,
    title: "Choose your rental",
    description:
      "Review equipment details, rental terms, owner information, and availability before selecting your preferred dates.",
  },
  {
    number: "03",
    icon: ClipboardCheck,
    title: "Book & get to work",
    description:
      "Complete your booking securely, confirm the rental, and get the equipment ready for your project.",
  },
];

const ownerSteps = [
  {
    icon: UserRoundPlus,
    title: "Create your owner profile",
    description:
      "Set up your owner account and build a trusted profile for customers looking for reliable equipment.",
  },
  {
    icon: PackageCheck,
    title: "List your equipment",
    description:
      "Add equipment details, photos, pricing, availability, and rental information to your listing.",
  },
  {
    icon: CircleDollarSign,
    title: "Manage & earn",
    description:
      "Manage incoming bookings, track rentals, and grow your equipment rental business through rEntsy.",
  },
];

const trustPoints = [
  {
    icon: BadgeCheck,
    title: "Verified listings",
    description: "Clear equipment information before you book.",
  },
  {
    icon: ShieldCheck,
    title: "Secure booking",
    description: "A structured booking and payment experience.",
  },
  {
    icon: FileCheck2,
    title: "Transparent details",
    description: "Know the price, availability, and rental terms.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden border-t border-slate-200/80 bg-white text-slate-900 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
    >
      {/* Subtle background decoration */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[700px] -translate-x-1/2 bg-[radial-gradient(circle,rgba(110,19,249,0.09)_0%,rgba(110,19,249,0)_68%)] dark:bg-[radial-gradient(circle,rgba(139,69,255,0.12)_0%,rgba(139,69,255,0)_68%)]" />

      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-[#6e13f9]/20 bg-[#6e13f9]/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6e13f9] dark:border-[#a66cff]/25 dark:bg-[#6e13f9]/10 dark:text-[#b78aff]">
            Simple rental process
          </span>

          <h2 className="mt-5 text-3xl font-extrabold tracking-[-0.04em] text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">
            How
            <span className="text-[#6e13f9] dark:text-[#a66cff]"> rEntsy</span>{" "}
            works.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base sm:leading-8">
            Whether you need equipment for your next project or want to earn
            from machines you already own, rEntsy keeps the entire rental
            process clear and straightforward.
          </p>
        </div>

        {/* For Renters */}
        <div className="mx-auto mt-16 max-w-6xl">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6e13f9] dark:text-[#a66cff]">
                For renters
              </p>

              <h3 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-slate-950 dark:text-white sm:text-3xl">
                From search to booking in three steps.
              </h3>
            </div>

            <Link
              href="/equipment"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-[#6e13f9] transition hover:text-[#580dd4] dark:text-[#b78aff] dark:hover:text-white"
            >
              <span>Browse equipment</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="pointer-events-none absolute left-[16%] right-[16%] top-12 hidden h-px bg-gradient-to-r from-[#6e13f9]/20 via-[#6e13f9]/40 to-[#6e13f9]/20 md:block dark:from-[#a66cff]/20 dark:via-[#a66cff]/40 dark:to-[#a66cff]/20" />

            {renterSteps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#6e13f9]/40 hover:shadow-[0_18px_40px_-20px_rgba(110,19,249,0.25)] dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-[#a66cff]/40"
                >
                  <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#6e13f9]/[0.04] transition-transform duration-500 group-hover:scale-125 dark:bg-[#a66cff]/[0.06]" />

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-xs font-extrabold tracking-[0.2em] text-[#6e13f9] dark:text-[#a66cff]">
                      {step.number}
                    </span>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#6e13f9]/15 bg-[#6e13f9]/[0.07] text-[#6e13f9] transition-colors duration-300 group-hover:bg-[#6e13f9] group-hover:text-white dark:border-[#a66cff]/20 dark:bg-[#a66cff]/10 dark:text-[#b78aff] dark:group-hover:bg-[#8b45ff] dark:group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-12">
                    <h4 className="text-lg font-bold tracking-[-0.02em] text-slate-950 dark:text-white">
                      {step.title}
                    </h4>

                    <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* For Equipment Owners */}
        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="relative overflow-hidden rounded-2xl border border-[#6e13f9]/20 bg-gradient-to-br from-[#6e13f9] via-[#5d0fd8] to-[#4709ab] p-8 text-white shadow-[0_20px_50px_-20px_rgba(110,19,249,0.55)] sm:p-10 lg:col-span-5">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-fuchsia-400/15 blur-3xl" />

            <div className="relative">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-200">
                For equipment owners
              </span>

              <h3 className="mt-4 max-w-md text-2xl font-extrabold leading-tight tracking-[-0.03em] sm:text-3xl">
                Turn unused equipment into a rental opportunity.
              </h3>

              <p className="mt-4 max-w-md text-sm leading-7 text-purple-100/90">
                List your equipment, control your rental information, and manage
                bookings from one organized platform.
              </p>

              <Link
                href="/list-equipment"
                className="group mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#6e13f9] transition hover:bg-purple-50"
              >
                <Truck className="h-4 w-4" />
                <span>List your equipment</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-7">
            {ownerSteps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-slate-50/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#6e13f9]/35 hover:bg-white dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-[#a66cff]/35 dark:hover:bg-slate-900"
                >
                  <div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#6e13f9]/15 bg-white text-[#6e13f9] transition-colors duration-300 group-hover:bg-[#6e13f9] group-hover:text-white dark:border-slate-700 dark:bg-slate-800 dark:text-[#b78aff] dark:group-hover:bg-[#8b45ff] dark:group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h4 className="mt-6 text-base font-bold tracking-[-0.02em] text-slate-950 dark:text-white">
                      {step.title}
                    </h4>

                    <p className="mt-2.5 text-sm leading-6 text-slate-600 dark:text-slate-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trust Points */}
        <div className="mx-auto mt-16 max-w-6xl rounded-2xl border border-slate-200/90 bg-slate-50/80 p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {trustPoints.map((point) => {
              const Icon = point.icon;

              return (
                <div key={point.title} className="flex items-start gap-3.5">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#6e13f9]/10 text-[#6e13f9] dark:bg-[#a66cff]/10 dark:text-[#b78aff]">
                    <Icon className="h-4 w-4" />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-950 dark:text-white">
                      {point.title}
                    </h4>

                    <p className="mt-1 text-xs leading-6 text-slate-600 dark:text-slate-400 sm:text-sm">
                      {point.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mx-auto mt-16 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <CheckCircle2 className="h-4 w-4 text-[#6e13f9] dark:text-[#a66cff]" />
            <span>Ready to start renting or listing on rEntsy?</span>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/equipment"
              className="inline-flex items-center gap-2 rounded-full bg-[#6e13f9] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#580dd4]"
            >
              <span>Explore Equipment</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/list-equipment"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-[#6e13f9] hover:text-[#6e13f9] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#a66cff] dark:hover:text-[#b78aff]"
            >
              Become an Owner
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}