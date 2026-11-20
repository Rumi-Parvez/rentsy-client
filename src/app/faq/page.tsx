import type { Metadata } from "next";
import Link from "next/link";
import { LifeBuoy, Mail, MessageCircleQuestion, Search } from "lucide-react";

import { CtaPanel, PublicPage, SectionTitle } from "../components/public/PublicPage";
import { FaqAccordion, type FaqItem } from "../components/public/FaqAccordion";

export const metadata: Metadata = {
  title: "FAQ — rEntsy Equipment Rental",
  description:
    "Answers to common questions about renting equipment, listing gear, bookings, payments and accounts on rEntsy.",
};

const groups: Array<{ title: string; description: string; items: FaqItem[] }> = [
  {
    title: "Renting equipment",
    description: "Everything customers ask before their first booking.",
    items: [
      {
        question: "How do I rent equipment on rEntsy?",
        answer:
          "Create a customer account, browse or search the equipment catalog, open the listing you need and choose Book Now. Select your rental dates, quantity and delivery details, then submit the booking request. The owner confirms availability and the rental moves to your dashboard.",
      },
      {
        question: "Do I need an account to browse equipment?",
        answer:
          "You can browse the public catalog and category pages without signing in. Viewing full equipment details, saving favorites and booking require a signed-in account so we can protect owner information and keep bookings secure.",
      },
      {
        question: "How is the rental price calculated?",
        answer:
          "Each listing has a rental rate and billing type (hourly, daily, weekly or monthly). The booking total is calculated from the number of billing units between your start and end dates, multiplied by the quantity you request.",
      },
      {
        question: "Can I rent more than one unit of the same equipment?",
        answer:
          "Yes. The booking form lets you choose a quantity up to the available stock for that listing. If you need more units than are listed, contact support and we will help you coordinate with the owner.",
      },
      {
        question: "What happens if the owner rejects my booking?",
        answer:
          "You will see the status change in My Rentals. Nothing is charged for a rejected request, and you are free to book another listing or contact support for help finding an alternative.",
      },
      {
        question: "Can I cancel a booking?",
        answer:
          "Customers can cancel a booking while it is still pending or confirmed. Once a rental is ongoing or completed, cancellation is handled through support so both sides can resolve the return and any charges.",
      },
    ],
  },
  {
    title: "Payments and refunds",
    description: "How money moves through the marketplace.",
    items: [
      {
        question: "Which payment methods are supported?",
        answer:
          "rEntsy is built around secure online checkout. Card payments are processed through our payment provider and you never share card details with equipment owners directly.",
      },
      {
        question: "When am I charged?",
        answer:
          "Your payment is captured as part of the checkout step after the booking details are confirmed. The payment status is visible in My Rentals and in the owner and admin dashboards.",
      },
      {
        question: "How do refunds work?",
        answer:
          "If a booking is cancelled before the rental starts, the refund is reviewed against the owner's rental terms. Approved refunds are returned to the original payment method and recorded against the booking.",
      },
      {
        question: "Are there hidden fees?",
        answer:
          "No. The booking form shows the calculated rental total before you confirm. Any delivery or site-specific charges should be agreed with the owner before the rental begins.",
      },
    ],
  },
  {
    title: "For equipment owners",
    description: "Listing, approvals and getting paid.",
    items: [
      {
        question: "How do I list my equipment?",
        answer:
          "Sign in with an owner account and open Add Equipment from your dashboard. Add the equipment details, photos, rental rate, quantity and terms, then submit. New listings start as pending until an admin reviews them.",
      },
      {
        question: "Why is my listing pending?",
        answer:
          "Every new listing is reviewed to keep the marketplace trustworthy. Admins check that the details are complete and the equipment is suitable for rental. You can track the status in My Equipment.",
      },
      {
        question: "Can I update or remove a listing?",
        answer:
          "Yes. Owners can edit their own equipment from the dashboard. Listings with active bookings cannot be deleted until those rentals are completed or cancelled.",
      },
      {
        question: "How do I respond to a rental request?",
        answer:
          "Open My Equipment Rental in the owner dashboard. Each request shows the customer, rental dates, quantity and amount. From there you can confirm, reject, mark the rental ongoing or complete it.",
      },
    ],
  },
  {
    title: "Accounts and security",
    description: "Keeping your account safe.",
    items: [
      {
        question: "Which roles exist on rEntsy?",
        answer:
          "There are three roles: customer, owner and admin. Customers book equipment, owners list and manage equipment, and admins review listings and manage users. Your role determines which dashboard sections you can access.",
      },
      {
        question: "How do I change my role?",
        answer:
          "Customers can choose to become an owner when creating an account. After registration, role changes are handled by an admin from the All Users page to prevent unauthorized access.",
      },
      {
        question: "Is my personal information secure?",
        answer:
          "Yes. Authentication is handled with secure sessions and signed tokens, and private API routes verify your identity and role on every request. Your password is never stored in plain text.",
      },
      {
        question: "I forgot my password. What should I do?",
        answer:
          "Use the Forgot Password page to send a reset request to our support team. We verify the request against your account email and help you regain access securely.",
      },
    ],
  },
];

const allItems = groups.flatMap((group) => group.items);

export default function FaqPage() {
  return (
    <PublicPage
      eyebrow="Help center"
      title="Frequently asked"
      highlight="questions."
      description="Quick answers about renting, listing, payments and account security. If your question is not here, our support team is one message away."
      action={
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6e13f9] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#6e13f9]/20 transition hover:bg-[#5b0ed6]"
          >
            <Mail className="h-4 w-4" />
            Ask support
          </Link>
          <Link
            href="/support"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-[#6e13f9] hover:text-[#6e13f9] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#a66cff] dark:hover:text-[#a66cff]"
          >
            <LifeBuoy className="h-4 w-4" />
            Support center
          </Link>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            icon: Search,
            title: "Browse first",
            text: "Public catalog and categories are open to everyone.",
          },
          {
            icon: MessageCircleQuestion,
            title: "Ask anything",
            text: `${allItems.length} answers across four help topics.`,
          },
          {
            icon: LifeBuoy,
            title: "Still stuck?",
            text: "Send a message and get a reply within one business day.",
          },
        ].map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#6e13f9]/10 text-[#6e13f9] dark:bg-[#6e13f9]/20 dark:text-[#c4a4ff]">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {card.title}
                </p>
                <p className="mt-1 text-[11px] leading-5 text-slate-500 dark:text-slate-400">
                  {card.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {groups.map((group) => (
        <section key={group.title}>
          <SectionTitle title={group.title} description={group.description} />
          <div className="mt-5">
            <FaqAccordion items={group.items} defaultOpen={-1} />
          </div>
        </section>
      ))}

      <CtaPanel
        title="Didn't find your answer?"
        description="Send us the details and our support team will help you get unstuck."
        primaryHref="/contact"
        primaryLabel="Contact support"
        secondaryHref="/support"
        secondaryLabel="Visit help center"
      />
    </PublicPage>
  );
}
