import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  CreditCard,
  Headphones,
  Mail,
  MessageSquare,
  Phone,
  ShieldCheck,
  UserCog,
} from "lucide-react";

import { CtaPanel, InfoCard, PublicPage, SectionTitle } from "../components/public/PublicPage";

export const metadata: Metadata = {
  title: "Support — rEntsy Equipment Rental",
  description:
    "Get help with bookings, payments, equipment listings and account access on rEntsy.",
};

const channels = [
  {
    icon: Mail,
    title: "Email support",
    description: "Best for detailed questions and account-specific issues.",
    value: "help@rentsy.com",
    href: "mailto:help@rentsy.com",
    action: "Send an email",
  },
  {
    icon: Phone,
    title: "Phone hotline",
    description: "Available Sunday to Thursday, 9:00–18:00 local time.",
    value: "01407794143",
    href: "tel:01407794143",
    action: "Call support",
  },
  {
    icon: MessageSquare,
    title: "Contact form",
    description: "Attach the details and we will route it to the right team.",
    value: "Response within 1 business day",
    href: "/contact",
    action: "Open form",
  },
];

const topics = [
  {
    icon: CalendarCheck,
    title: "Booking help",
    description:
      "Change dates, understand rental status, cancel a pending request or coordinate a return with the owner.",
    href: "/faq",
    linkLabel: "Booking FAQ",
  },
  {
    icon: CreditCard,
    title: "Payments & refunds",
    description:
      "Understand charges, payment status, receipts and the refund review process for cancelled rentals.",
    href: "/faq",
    linkLabel: "Payment FAQ",
  },
  {
    icon: ShieldCheck,
    title: "Safety & trust",
    description:
      "Report a listing, ask about verification, or raise a concern about a rental interaction.",
    href: "/contact",
    linkLabel: "Report an issue",
  },
  {
    icon: UserCog,
    title: "Account access",
    description:
      "Reset your password, update your profile or request a role change from a platform admin.",
    href: "/forgot-password",
    linkLabel: "Reset access",
  },
];

const quickLinks = [
  { label: "How it works", href: "/how-it-works" },
  { label: "Rental process", href: "/rental-process" },
  { label: "Pricing", href: "/pricing" },
  { label: "Browse equipment", href: "/equipment" },
];

export default function SupportPage() {
  return (
    <PublicPage
      eyebrow="Support center"
      title="We're here to"
      highlight="help."
      description="Whether you are booking your first rental, managing a fleet or stuck on your account, our support team is ready to help."
      action={
        <Link
          href="/contact"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6e13f9] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#6e13f9]/20 transition hover:bg-[#5b0ed6]"
        >
          <Headphones className="h-4 w-4" />
          Contact support
        </Link>
      }
    >
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {channels.map((channel) => {
          const Icon = channel.icon;

          return (
            <div
              key={channel.title}
              className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6e13f9]/10 text-[#6e13f9] dark:bg-[#6e13f9]/20 dark:text-[#c4a4ff]">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-base font-bold">{channel.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {channel.description}
              </p>
              <p className="mt-3 flex-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
                {channel.value}
              </p>
              <a
                href={channel.href}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#6e13f9] transition hover:underline dark:text-[#a66cff]"
              >
                {channel.action}
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          );
        })}
      </section>

      <section>
        <SectionTitle
          title="Find help by topic"
          description="Start with the area that matches your question."
        />
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {topics.map((topic) => {
            const Icon = topic.icon;

            return (
              <InfoCard
                key={topic.title}
                icon={<Icon className="h-5 w-5" />}
                title={topic.title}
                href={topic.href}
                linkLabel={topic.linkLabel}
              >
                {topic.description}
              </InfoCard>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <SectionTitle
            title="Before you contact us"
            description="These details help us resolve your issue on the first reply."
          />
          <ul className="mt-5 space-y-4">
            {[
              "Your account email address.",
              "The booking ID or equipment name involved (if any).",
              "The dates and amount you expected to see.",
              "A screenshot or short description of the error.",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm leading-6 text-slate-600 dark:text-slate-400"
              >
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                  <ShieldCheck className="h-3 w-3" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <BookOpen className="h-4 w-4" />
            Quick links
          </p>
          <div className="mt-4 space-y-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-[#6e13f9] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-[#a66cff]"
              >
                {link.label}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>

          <div className="mt-5 rounded-xl bg-slate-50 p-4 text-[11px] leading-5 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
            Support hours: Sunday–Thursday, 9:00–18:00. Messages sent outside
            these hours are answered the next business day.
          </div>
        </div>
      </section>

      <CtaPanel
        title="Need a person, not a page?"
        description="Send us a message with your account email and booking details. A real support specialist will reply."
        primaryHref="/contact"
        primaryLabel="Contact support"
        secondaryHref="/faq"
        secondaryLabel="Read the FAQ"
      />
    </PublicPage>
  );
}
