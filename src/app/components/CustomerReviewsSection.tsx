"use client";

import React from "react";
import { Quote, Star } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

type CustomerReview = {
  id: string;
  customerName: string;
  roleOrContext: string;
  rating: number;
  comment: string;
  category: string;
};

const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: "rev-1",
    customerName: "Tanvir Ahmed",
    roleOrContext: "Site Supervisor • Dhaka",
    rating: 5,
    comment:
      "Booked a CAT 320D excavator for our earthworks project and the machine arrived in great condition. Transparent daily pricing made budgeting effortless.",
    category: "Construction Equipment",
  },
  {
    id: "rev-2",
    customerName: "Nusrat Jahan",
    roleOrContext: "Event & Transport Coordinator • Narsingdi",
    rating: 5,
    comment:
      "The microbus rental was smooth from start to finish. Clear availability, responsive owner communication, and straightforward booking dates.",
    category: "Vehicles",
  },
  {
    id: "rev-3",
    customerName: "Farhanul Islam",
    roleOrContext: "Studio Producer • Dhaka",
    rating: 5,
    comment:
      "Flexible rental periods saved us money on a weekend shoot. Having gear specs, terms, and pricing in one place is super convenient.",
    category: "Photography Equipment",
  },
  {
    id: "rev-4",
    customerName: "Mahmudul Hasan",
    roleOrContext: "Contractor • Gazipur",
    rating: 4,
    comment:
      "Reliable equipment owners and quick confirmation when scheduling future rental dates. Great platform for short and extended project needs.",
    category: "Electronics",
  },
];

function RatingStars({ rating }: { rating: number }) {
  const clamped = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <div
      className="flex items-center gap-1"
      aria-label={`${clamped} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index < clamped;
        return (
          <Star
            key={index}
            className={`h-4 w-4 ${
              filled
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-slate-300 dark:text-slate-700"
            }`}
          />
        );
      })}
      <span className="ml-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
        {clamped.toFixed(1)}
      </span>
    </div>
  );
}

export default function CustomerReviewsSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="customer-reviews"
      className="w-full border-t border-slate-200/80 bg-slate-50 px-4 py-16 text-slate-900 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950 dark:text-white sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end"
          initial={reduceMotion ? undefined : { opacity: 0, y: 22, filter: "blur(8px)" }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#6e13f9]/20 bg-[#6e13f9]/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#6e13f9] dark:border-[#a66cff]/25 dark:text-[#b78aff]">
              <Quote className="h-3.5 w-3.5" />
              <span>Customer Reviews</span>
            </div>

            <h2 className="text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
              Trusted by{" "}
              <span className="text-[#6e13f9] dark:text-[#a66cff]">
                renters &amp; teams.
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
              Real feedback from customers renting equipment for construction,
              transport, media shoots, and site operations.
            </p>
          </div>
        </motion.div>

        {/* 4+ Customer Review Cards */}
        <motion.div
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          initial={reduceMotion ? undefined : "hidden"}
          whileInView={reduceMotion ? undefined : "show"}
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.09 } },
          }}
        >
          {CUSTOMER_REVIEWS.map((review) => (
            <motion.article
              key={review.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm transition-colors duration-300 hover:border-[#6e13f9]/50 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
              variants={{
                hidden: {
                  opacity: 0,
                  y: 26,
                  filter: "blur(8px)",
                },
                show: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: {
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  },
                },
              }}
              whileHover={
                reduceMotion ? undefined : { y: -6 }
              }
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <RatingStars rating={review.rating} />
                  <span className="rounded-full bg-[#6e13f9]/10 px-2.5 py-0.5 text-[8px] font-bold text-[#6e13f9] dark:text-[#b78aff]">
                    {review.category}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {review.customerName}
                </h3>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {review.roleOrContext}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}