import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Globe2,
  GraduationCap,
  HeartPulse,
  Laptop,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";

import { CtaPanel, InfoCard, PublicPage, SectionTitle } from "../components/public/PublicPage";

export const metadata: Metadata = {
  title: "Careers — rEntsy Equipment Rental",
  description:
    "Join the team building a simpler, more trustworthy equipment rental marketplace.",
};

const roles = [
  {
    title: "Senior Full-Stack Engineer",
    team: "Engineering",
    location: "Remote · Asia",
    type: "Full-time",
    description:
      "Own features across our Next.js frontend and Express API, from data modelling to polished dashboards.",
  },
  {
    title: "Product Designer",
    team: "Design",
    location: "Remote · Global",
    type: "Full-time",
    description:
      "Shape the rental journey end to end, from the first catalog visit to booking confirmation and owner tools.",
  },
  {
    title: "Customer Support Specialist",
    team: "Operations",
    location: "Remote · Asia",
    type: "Full-time",
    description:
      "Help renters and owners resolve booking questions with empathy, clarity and fast follow-through.",
  },
  {
    title: "Growth & Partnerships Lead",
    team: "Marketing",
    location: "Hybrid · Dhaka",
    type: "Contract",
    description:
      "Build relationships with equipment owners and trade communities to grow verified supply on the platform.",
  },
];

const perks = [
  {
    icon: Globe2,
    title: "Remote-friendly",
    description: "Work from where you are productive, with async-first collaboration.",
  },
  {
    icon: Clock,
    title: "Flexible hours",
    description: "Plan your day around deep work instead of a rigid clock.",
  },
  {
    icon: GraduationCap,
    title: "Learning budget",
    description: "Annual support for courses, books and conferences that level you up.",
  },
  {
    icon: HeartPulse,
    title: "Wellbeing support",
    description: "Time off that is actually respected, plus health and wellness allowances.",
  },
  {
    icon: Laptop,
    title: "Good tools",
    description: "The equipment and software you need to do your best work.",
  },
  {
    icon: Users,
    title: "Small, senior team",
    description: "Less process, more ownership and direct impact on the product.",
  },
];

export default function CareersPage() {
  return (
    <PublicPage
      eyebrow="Careers"
      title="Build the future of"
      highlight="equipment rental."
      description="We are a small team solving a practical problem: helping equipment owners earn more and renters find exactly what they need, without friction."
      action={
        <Link
          href="mailto:careers@rentsy.com?subject=Application%20for%20rEntsy"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6e13f9] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#6e13f9]/20 transition hover:bg-[#5b0ed6]"
        >
          Send your application
          <ArrowRight className="h-4 w-4" />
        </Link>
      }
    >
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { value: "4", label: "Open roles" },
          { value: "Remote", label: "Work style" },
          { value: "3", label: "Continents represented" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 text-center dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-2xl font-black text-[#6e13f9] dark:text-[#a66cff]">
              {stat.value}
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
              {stat.label}
            </p>
          </div>
        ))}
      </section>

      <section>
        <SectionTitle
          title="Open positions"
          description="Every role is hands-on. You will ship real changes that renters and owners use every day."
        />

        <div className="mt-6 space-y-4">
          {roles.map((role) => (
            <article
              key={role.title}
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-[#6e13f9]/40 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#6e13f9]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#6e13f9] dark:bg-[#6e13f9]/20 dark:text-[#c4a4ff]">
                      {role.team}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {role.type}
                    </span>
                  </div>

                  <h3 className="mt-3 text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {role.title}
                  </h3>

                  <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {role.description}
                  </p>

                  <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <MapPin className="h-3.5 w-3.5 text-[#6e13f9] dark:text-[#a66cff]" />
                    {role.location}
                  </p>
                </div>

                <Link
                  href={`mailto:careers@rentsy.com?subject=${encodeURIComponent(
                    `Application: ${role.title}`
                  )}`}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:border-[#6e13f9] hover:bg-[#6e13f9] hover:text-white dark:border-slate-700 dark:text-slate-200"
                >
                  Apply now
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle
          title="Why you'll like it here"
          description="We keep the team small so the work stays meaningful."
        />
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {perks.map((perk) => {
            const Icon = perk.icon;

            return (
              <InfoCard
                key={perk.title}
                icon={<Icon className="h-5 w-5" />}
                title={perk.title}
              >
                {perk.description}
              </InfoCard>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#6e13f9]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#6e13f9] dark:bg-[#6e13f9]/20 dark:text-[#c4a4ff]">
              <Sparkles className="h-3 w-3" />
              How we hire
            </span>
            <h2 className="mt-3 text-xl font-extrabold tracking-tight sm:text-2xl">
              A short, human process
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">
              Apply by email with your resume and a short note about what you
              want to build. We reply to every application, then run a
              conversation, a practical exercise and a team chat — no endless
              rounds.
            </p>
          </div>

          <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:max-w-sm">
            {[
              "Application review",
              "Intro conversation",
              "Practical exercise",
              "Team conversation",
            ].map((step, index) => (
              <li
                key={step}
                className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:text-slate-300"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#6e13f9] text-[10px] font-bold text-white">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaPanel
        title="Don't see your role?"
        description="We are always interested in people who care about marketplaces, logistics and great product craft. Send a speculative application."
        primaryHref="mailto:careers@rentsy.com?subject=Speculative%20application"
        primaryLabel="Email our team"
        secondaryHref="/about"
        secondaryLabel="About rEntsy"
      />
    </PublicPage>
  );
}
