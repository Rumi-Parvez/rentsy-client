import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  Info,
  ShieldCheck,
  Store,
  UserRound,
} from "lucide-react";

import { CtaPanel, PublicPage, SectionTitle } from "../components/public/PublicPage";

export const metadata: Metadata = {
  title: "Pricing — rEntsy Equipment Rental",
  description:
    "Simple, transparent pricing for renters and equipment owners on the rEntsy marketplace.",
};

const plans = [
  {
    name: "Renter",
    icon: UserRound,
    price: "Free",
    period: "to browse and join",
    description:
      "Everything a customer needs to find, favorite and book equipment.",
    features: [
      "Browse the full approved catalog",
      "Search, filter and sort equipment",
      "Save unlimited favorites",
      "Book rentals and track status",
      "Rental history in your dashboard",
    ],
    cta: "Create customer account",
    href: "/sign-up",
    featured: false,
  },
  {
    name: "Owner",
    icon: Store,
    price: "10%",
    period: "platform fee per completed rental",
    description:
      "List your equipment and earn from it. No upfront listing cost.",
    features: [
      "Unlimited equipment listings",
      "Owner dashboard and analytics",
      "Manage rental requests",
      "Approval workflow for listings",
      "Payout tracking on completed rentals",
    ],
    cta: "Become an owner",
    href: "/sign-up",
    featured: true,
  },
  {
    name: "Enterprise",
    icon: Building2,
    price: "Custom",
    period: "for fleets and teams",
    description:
      "For businesses that manage large fleets or recurring rental demand.",
    features: [
      "Dedicated onboarding",
      "Bulk equipment management",
      "Priority support channel",
      "Custom reporting needs",
      "Account and role review",
    ],
    cta: "Talk to our team",
    href: "/contact",
    featured: false,
  },
];

const faqs = [
  {
    question: "Is it free to create an account?",
    answer:
      "Yes. Creating a customer or owner account is free. Renters only pay the rental total at checkout and owners pay a platform fee on completed rentals.",
  },
  {
    question: "When is the owner fee charged?",
    answer:
      "The platform fee is calculated on completed rentals, so you are never charged for listings that do not result in a booking.",
  },
  {
    question: "Do customers pay a service fee?",
    answer:
      "The price you see is the calculated rental price for the dates and quantity you select. There are no hidden platform charges added at checkout.",
  },
  {
    question: "Can pricing change?",
    answer:
      "We review pricing as the marketplace grows. Any changes will be announced before they take effect and will not apply retroactively to confirmed bookings.",
  },
];

export default function PricingPage() {
  return (
    <PublicPage
      eyebrow="Pricing"
      title="Transparent pricing,"
      highlight="no surprises."
      description="Start for free, list your equipment without upfront cost and only pay when a rental is completed. Here is exactly how rEntsy works."
    >
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isFeatured = plan.featured;

          return (
            <div
              key={plan.name}
              className={`relative flex h-full flex-col rounded-3xl border p-6 shadow-sm sm:p-7 ${
                isFeatured
                  ? "border-[#6e13f9] bg-gradient-to-b from-[#6e13f9] to-[#4c139f] text-white shadow-xl shadow-[#6e13f9]/25"
                  : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
              }`}
            >
              {isFeatured && (
                <span className="absolute -top-3 left-6 rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#6e13f9] shadow">
                  Most popular
                </span>
              )}

              <span
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                  isFeatured
                    ? "bg-white/15 text-white"
                    : "bg-[#6e13f9]/10 text-[#6e13f9] dark:bg-[#6e13f9]/20 dark:text-[#c4a4ff]"
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>

              <h2
                className={`mt-4 text-lg font-extrabold tracking-tight ${
                  isFeatured ? "text-white" : "text-slate-900 dark:text-white"
                }`}
              >
                {plan.name}
              </h2>

              <p
                className={`mt-1 text-xs leading-5 ${
                  isFeatured
                    ? "text-purple-100"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {plan.description}
              </p>

              <div className="mt-6 flex items-end gap-1.5">
                <span
                  className={`text-4xl font-black tracking-tight ${
                    isFeatured ? "text-white" : "text-[#6e13f9] dark:text-[#a66cff]"
                  }`}
                >
                  {plan.price}
                </span>
                <span
                  className={`pb-1 text-[11px] font-medium ${
                    isFeatured
                      ? "text-purple-200"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {plan.period}
                </span>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-xs leading-5">
                    <Check
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        isFeatured
                          ? "text-emerald-300"
                          : "text-emerald-500"
                      }`}
                    />
                    <span
                      className={
                        isFeatured
                          ? "text-purple-50"
                          : "text-slate-600 dark:text-slate-400"
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`mt-7 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition ${
                  isFeatured
                    ? "bg-white text-[#3b0c8f] hover:bg-purple-50"
                    : "bg-[#6e13f9] text-white hover:bg-[#5b0ed6]"
                }`}
              >
                {plan.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          );
        })}
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p className="text-xs leading-6">
            <strong className="font-bold">How totals are calculated:</strong>{" "}
            rental rate × billing units between your dates × quantity. The
            booking form previews the total before you confirm, and the final
            amount is recorded on the booking.
          </p>
        </div>
      </section>

      <section>
        <SectionTitle
          title="Pricing questions"
          description="The short answers to what owners and renters ask most."
        />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {faq.question}
              </h3>
              <p className="mt-2 text-xs leading-6 text-slate-600 dark:text-slate-400">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            icon: ShieldCheck,
            title: "Secure checkout",
            text: "Payments are processed through a secure online flow.",
          },
          {
            icon: BadgeCheck,
            title: "Verified listings",
            text: "Admins review new equipment before it goes live.",
          },
          {
            icon: Store,
            title: "No listing fees",
            text: "Owners list equipment for free and pay on completed rentals.",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <Icon className="h-5 w-5 text-[#6e13f9] dark:text-[#a66cff]" />
              <h3 className="mt-3 text-sm font-bold">{item.title}</h3>
              <p className="mt-1.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                {item.text}
              </p>
            </div>
          );
        })}
      </section>

      <CtaPanel
        title="Start renting or listing today"
        description="Create a free account and choose the role that fits how you use equipment."
        primaryHref="/sign-up"
        primaryLabel="Create an account"
        secondaryHref="/contact"
        secondaryLabel="Ask a question"
      />
    </PublicPage>
  );
}
