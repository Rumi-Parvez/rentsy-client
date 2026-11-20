import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck,
  Building2,
  Handshake,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Target,
  Truck,
  Users,
} from "lucide-react";

import { CtaPanel, InfoCard, PublicPage, SectionTitle } from "../components/public/PublicPage";

export const metadata: Metadata = {
  title: "About rEntsy — Equipment Rental Marketplace",
  description:
    "Learn how rEntsy connects equipment owners with renters through a transparent, secure rental marketplace.",
};

const stats = [
  { value: "6", label: "Equipment categories" },
  { value: "3", label: "Account roles supported" },
  { value: "24/7", label: "Marketplace availability" },
  { value: "100%", label: "Verified listings" },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Trust first",
    description:
      "Every listing is reviewed before it appears in the marketplace, so renters know exactly what they are booking.",
  },
  {
    icon: Handshake,
    title: "Fair for both sides",
    description:
      "Owners earn from idle equipment while renters access the gear they need without the cost of ownership.",
  },
  {
    icon: Sparkles,
    title: "Simple by design",
    description:
      "Clear pricing, structured bookings and one dashboard for every role keep the rental process easy to follow.",
  },
  {
    icon: HeartHandshake,
    title: "People behind the platform",
    description:
      "Our support team helps with bookings, account questions and listing issues from first click to return.",
  },
];

const milestones = [
  {
    year: "The problem",
    title: "Equipment sits idle",
    description:
      "Contractors, farmers, studios and event teams often own equipment that is only used a few days a month.",
  },
  {
    year: "The idea",
    title: "A marketplace for every role",
    description:
      "rEntsy was designed around three roles — customers, owners and admins — each with a purpose-built dashboard.",
  },
  {
    year: "The build",
    title: "One transparent workflow",
    description:
      "Listings, approvals, bookings, favorites and rental tracking were brought into a single, secure flow.",
  },
  {
    year: "Today",
    title: "Rent smarter",
    description:
      "rEntsy connects verified equipment with the people who need it, without hidden steps or paperwork.",
  },
];

export default function AboutPage() {
  return (
    <PublicPage
      eyebrow="About rEntsy"
      title="Equipment rental, made"
      highlight="human."
      description="rEntsy is a modern rental marketplace where equipment owners list their gear and customers book exactly what they need — for a day, a week or a season."
      action={
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/equipment"
            className="inline-flex items-center justify-center rounded-xl bg-[#6e13f9] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#6e13f9]/20 transition hover:bg-[#5b0ed6]"
          >
            Explore equipment
          </Link>
          <Link
            href="/how-it-works"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-[#6e13f9] hover:text-[#6e13f9] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#a66cff] dark:hover:text-[#a66cff]"
          >
            See how it works
          </Link>
        </div>
      }
    >
      <section className="grid grid-cols-2 gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-4 sm:p-8">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-3xl font-black tracking-tight text-[#6e13f9] dark:text-[#a66cff] sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
              {stat.label}
            </p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionTitle
            title="Why we built rEntsy"
            description="Renting equipment should feel as straightforward as booking a hotel room. We built rEntsy to remove the phone calls, guesswork and paperwork that usually come with equipment rental."
          />
          <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
            <p>
              Owners told us their equipment spends more time parked than
              working. Renters told us finding reliable gear nearby was slow and
              unpredictable. rEntsy connects both sides in one place, with
              verified listings and clear rental terms.
            </p>
            <p>
              Our platform is role-aware from the ground up. Customers browse and
              book, owners manage listings and rental requests, and admins keep
              the marketplace safe by reviewing every new listing before it goes
              live.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Truck, label: "Heavy equipment" },
            { icon: Building2, label: "Business rentals" },
            { icon: Users, label: "Verified owners" },
            { icon: BadgeCheck, label: "Reviewed listings" },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6e13f9]/10 text-[#6e13f9] dark:bg-[#6e13f9]/20 dark:text-[#c4a4ff]">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <SectionTitle
          title="What we stand for"
          description="The principles behind every product decision we make."
        />
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {values.map((value) => {
            const Icon = value.icon;

            return (
              <InfoCard
                key={value.title}
                icon={<Icon className="h-5 w-5" />}
                title={value.title}
              >
                {value.description}
              </InfoCard>
            );
          })}
        </div>
      </section>

      <section>
        <SectionTitle title="How we got here" />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {milestones.map((milestone) => (
            <div
              key={milestone.year}
              className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <span className="inline-flex rounded-full bg-[#6e13f9]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#6e13f9] dark:bg-[#6e13f9]/20 dark:text-[#c4a4ff]">
                {milestone.year}
              </span>
              <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                {milestone.title}
              </h3>
              <p className="mt-2 text-xs leading-6 text-slate-600 dark:text-slate-400">
                {milestone.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <CtaPanel
        title="Have equipment to list?"
        description="Turn idle gear into income. Create an owner account, add your equipment and let renters find it."
        primaryHref="/sign-up"
        primaryLabel="Become an owner"
        secondaryHref="/pricing"
        secondaryLabel="View pricing"
      />
    </PublicPage>
  );
}
