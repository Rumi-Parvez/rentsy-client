import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  CreditCard,
  LayoutDashboard,
  ListChecks,
  Search,
  ShieldCheck,
  Store,
  UserRound,
  Wrench,
} from "lucide-react";

import { CtaPanel, PublicPage, SectionTitle } from "../components/public/PublicPage";

export const metadata: Metadata = {
  title: "How It Works — rEntsy Equipment Rental",
  description:
    "See how renting equipment and listing your own gear works on the rEntsy marketplace.",
};

const renterSteps = [
  {
    icon: Search,
    title: "Find the right equipment",
    description:
      "Browse by category or search by name, brand and location. Filter by rental type and price to narrow the list.",
  },
  {
    icon: CalendarCheck,
    title: "Choose your rental dates",
    description:
      "Open the listing, review the specs and rental terms, then pick your start and end dates and quantity.",
  },
  {
    icon: CreditCard,
    title: "Confirm and pay securely",
    description:
      "Add your contact and delivery details. The total is calculated before you confirm and checkout is handled securely.",
  },
  {
    icon: LayoutDashboard,
    title: "Track the rental",
    description:
      "Follow confirmation, ongoing and completed status from My Rentals, and keep favorites for next time.",
  },
];

const ownerSteps = [
  {
    icon: Store,
    title: "Create an owner account",
    description:
      "Sign up and choose the owner role. Your dashboard unlocks equipment and rental management tools.",
  },
  {
    icon: Wrench,
    title: "List your equipment",
    description:
      "Add photos, specs, location, pricing, quantity and rental terms. New listings are submitted for review.",
  },
  {
    icon: BadgeCheck,
    title: "Get approved",
    description:
      "An admin reviews the listing. Once approved, it appears in the public catalog and can be booked.",
  },
  {
    icon: ListChecks,
    title: "Manage rentals",
    description:
      "Confirm or reject requests, mark rentals ongoing or complete, and monitor earnings from your dashboard.",
  },
];

const faqs = [
  {
    question: "How long does approval take?",
    answer:
      "Most listings are reviewed within one business day. You can track the status from My Equipment in your owner dashboard.",
  },
  {
    question: "Can I rent and list at the same time?",
    answer:
      "Your account has one role at a time. Customers can request an owner upgrade, and admins can change roles when appropriate.",
  },
  {
    question: "What happens after I book?",
    answer:
      "The owner receives the request and confirms availability. The booking status updates in your dashboard, and you can message support if anything changes.",
  },
];

export default function HowItWorksPage() {
  return (
    <PublicPage
      eyebrow="How it works"
      title="From search to site in"
      highlight="four steps."
      description="rEntsy keeps the rental journey short. Renters find and book equipment in minutes; owners list once and manage every request from one dashboard."
      action={
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/equipment"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6e13f9] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#6e13f9]/20 transition hover:bg-[#5b0ed6]"
          >
            Start browsing
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/rental-process"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-[#6e13f9] hover:text-[#6e13f9] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#a66cff] dark:hover:text-[#a66cff]"
          >
            Detailed rental process
          </Link>
        </div>
      }
    >
      <section>
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6e13f9]/10 text-[#6e13f9] dark:bg-[#6e13f9]/20 dark:text-[#c4a4ff]">
            <UserRound className="h-4 w-4" />
          </span>
          <SectionTitle
            title="For renters"
            description="Book the equipment you need without phone calls or paperwork."
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {renterSteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="relative rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="absolute right-4 top-4 text-3xl font-black text-slate-100 dark:text-slate-800">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6e13f9]/10 text-[#6e13f9] dark:bg-[#6e13f9]/20 dark:text-[#c4a4ff]">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-sm font-extrabold text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-6 text-slate-600 dark:text-slate-400">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6e13f9]/10 text-[#6e13f9] dark:bg-[#6e13f9]/20 dark:text-[#c4a4ff]">
            <Store className="h-4 w-4" />
          </span>
          <SectionTitle
            title="For equipment owners"
            description="Turn idle equipment into a managed rental business."
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ownerSteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="relative rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="absolute right-4 top-4 text-3xl font-black text-slate-100 dark:text-slate-800">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-sm font-extrabold text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-6 text-slate-600 dark:text-slate-400">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <ShieldCheck className="h-6 w-6 text-[#6e13f9] dark:text-[#a66cff]" />
          <h2 className="mt-4 text-xl font-extrabold tracking-tight">
            Built for trust
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">
            New listings are reviewed before they appear publicly. Private
            routes verify your session and role on every request, so customers,
            owners and admins only see the tools they are allowed to use.
          </p>
          <Link
            href="/about"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#6e13f9] hover:underline dark:text-[#a66cff]"
          >
            More about rEntsy
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <h2 className="text-xl font-extrabold tracking-tight">
            Common questions
          </h2>
          <div className="mt-4 space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {faq.question}
                </p>
                <p className="mt-1 text-xs leading-6 text-slate-600 dark:text-slate-400">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaPanel
        title="Ready to make your first move?"
        description="Browse the catalog as a renter or create an owner account and list your equipment."
        primaryHref="/equipment"
        primaryLabel="Browse equipment"
        secondaryHref="/sign-up"
        secondaryLabel="Create account"
      />
    </PublicPage>
  );
}
