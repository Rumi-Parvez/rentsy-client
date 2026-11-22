"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Package } from "lucide-react";
import Image from "@/components/ImageWithFallback";

type HeroCardItem = {
  id: string;
  label: string;
  category: string;
  imageUrl: string;
  desktopClass: string;
  rotateClass: string;
};

const HERO_CARDS: HeroCardItem[] = [
  {
    id: "excavator",
    label: "Excavator",
    category: "Earthmoving",
    imageUrl:
      "https://d2uhsaoc6ysewq.cloudfront.net/28475/Excavators-John-Deere-160G-LC-24984571.jpg",
    desktopClass:
      "lg:left-[3%] lg:top-[58%] lg:h-28 lg:w-24 xl:left-[5%] xl:h-32 xl:w-28",
    rotateClass: "-rotate-12",
  },
  {
    id: "forklift",
    label: "Forklift",
    category: "Material Handling",
    imageUrl:
      "https://www.bestforkliftrentals.com/images/hero-forklift.jpg",
    desktopClass:
      "lg:left-[12%] lg:top-[30%] lg:h-32 lg:w-28 xl:left-[14%] xl:h-36 xl:w-32",
    rotateClass: "-rotate-6",
  },
  {
    id: "crane",
    label: "Truck Crane",
    category: "Heavy Lifting",
    imageUrl:
      "https://media.base44.com/images/public/6954ca678e2c3f407fbdd60d/19da4f0fe_ChatGPTImageJan25202607_50_50AM.jpg",
    desktopClass:
      "lg:left-[24%] lg:top-[11%] lg:h-32 lg:w-28 xl:left-[25%] xl:h-36 xl:w-32",
    rotateClass: "-rotate-3",
  },
  {
    id: "concrete-mixer",
    label: "Concrete Mixer",
    category: "Construction",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/2528/3396/products/Belle-premier-xt-cement-mixer_580x%402x.png?v=1518474057",
    desktopClass:
      "lg:left-[38%] lg:top-[3%] lg:h-32 lg:w-28 xl:left-[39%] xl:h-36 xl:w-32",
    rotateClass: "-rotate-1",
  },
  {
    id: "boom-lift",
    label: "Boom Lift",
    category: "Access Equipment",
    imageUrl:
      "https://blog.iseekplant.com.au/hs-fs/hubfs/Imported_Blog_Media/telescopic%20boom%20lift.jpg",
    desktopClass:
      "lg:left-[52%] lg:top-[3%] lg:h-32 lg:w-28 xl:left-[52%] xl:h-36 xl:w-32",
    rotateClass: "rotate-2",
  },
  {
    id: "generator",
    label: "Generator",
    category: "Power Equipment",
    imageUrl:
      "https://sgh.com.au/cdn/shop/files/construction-site-at-sunset-with-generator.jpg?v=1781101193&width=3200",
    desktopClass:
      "lg:left-[66%] lg:top-[11%] lg:h-32 lg:w-28 xl:left-[65%] xl:h-36 xl:w-32",
    rotateClass: "rotate-5",
  },
  {
    id: "scaffolding",
    label: "Scaffolding",
    category: "Site Equipment",
    imageUrl:
      "https://rafeglobal.com/images/scaffolding_plural.png",
    desktopClass:
      "lg:left-[78%] lg:top-[30%] lg:h-32 lg:w-28 xl:left-[77%] xl:h-36 xl:w-32",
    rotateClass: "rotate-8",
  },
  {
    id: "pressure-washer",
    label: "Pressure Washer",
    category: "Cleaning Equipment",
    imageUrl:
      "https://quipli-service-prod-public.s3.amazonaws.com/rentwithmack/products/891/images/7512f356-6894-4c51-991d-c33d4140755d/ORIGINAL",
    desktopClass:
      "lg:left-[87%] lg:top-[58%] lg:h-28 lg:w-24 xl:left-[86%] xl:h-32 xl:w-28",
    rotateClass: "rotate-12",
  },
];

const HERO_FEATURES = [
  {
    title: "Verified Equipment",
    description:
      "Browse construction, lifting, power, and site equipment from trusted rental listings.",
  },
  {
    title: "Fast & Flexible Booking",
    description:
      "Find the right machine and reserve it for your project with clear rental details.",
  },
  {
    title: "Rent or List Your Fleet",
    description:
      "Rent equipment when you need it or list your own machines and grow your rental business.",
  },
] as const;

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function HeroSection() {
  const reduceMotion = useReducedMotion();

  const reveal = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 26, filter: "blur(10px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 0.65, delay, ease: EASE },
        };

  return (
    <section className="relative w-full overflow-hidden bg-white px-4 py-12 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      {/* Ambient blur accents */}
      <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
        <motion.div
          aria-hidden="true"
          className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-[#6e13f9]/20 blur-[90px] dark:bg-[#a66cff]/20"
          animate={
            reduceMotion
              ? undefined
              : { x: [0, 26, 0], y: [0, -18, 0] }
          }
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute -right-20 bottom-16 h-72 w-72 rounded-full bg-sky-400/15 blur-[100px] dark:bg-sky-500/10"
          animate={
            reduceMotion
              ? undefined
              : { x: [0, -24, 0], y: [0, 20, 0] }
          }
          transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Mobile / Tablet Equipment Strip */}
        <div className="mb-10 flex items-center gap-4 overflow-x-auto px-1 pb-4 scrollbar-none lg:hidden">
          {HERO_CARDS.map((card, index) => {
            const tiltClass = index % 2 === 0 ? "-rotate-2" : "rotate-2";
            const cardClasses = [
              "group relative block h-32 w-28 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 transition duration-300 dark:border-slate-800 dark:bg-slate-900 sm:h-36 sm:w-32",
              tiltClass,
            ].join(" ");

            return (
              <motion.div
                key={card.id}
                className="shrink-0"
                initial={
                  reduceMotion
                    ? undefined
                    : { opacity: 0, y: 22, filter: "blur(8px)" }
                }
                animate={
                  reduceMotion
                    ? undefined
                    : { opacity: 1, y: 0, filter: "blur(0px)" }
                }
                transition={{
                  duration: 0.55,
                  delay: 0.08 + index * 0.05,
                  ease: EASE,
                }}
              >
                <Link
                  href={`/equipment?category=${encodeURIComponent(card.category)}`}
                  className={cardClasses}
                >
                  <Image
                    src={card.imageUrl}
                    alt={`${card.label} rental equipment`}
                    fill
                    sizes="128px"
                    fallbackIcon={Package}
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-2.5">
                    <p className="text-[11px] font-bold text-white">
                      {card.label}
                    </p>

                    <p className="mt-0.5 text-[9px] font-medium text-white/70">
                      {card.category}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Desktop Equipment Arc */}
        <div className="relative min-h-[500px] sm:min-h-[540px] lg:min-h-[560px] xl:min-h-[600px]">
          {/* Equipment Cards */}
          <div className="pointer-events-none absolute inset-0 hidden lg:block">
            {HERO_CARDS.map((card, index) => {
              const desktopCardClasses = [
                "pointer-events-auto absolute overflow-hidden rounded-[20px] border border-white/20 bg-slate-100 shadow-lg shadow-slate-900/5 dark:bg-slate-900",
                card.desktopClass,
                card.rotateClass,
              ].join(" ");

              return (
                <motion.div
                  key={card.id}
                  className={desktopCardClasses}
                  initial={
                    reduceMotion
                      ? undefined
                      : {
                          opacity: 0,
                          y: 40,
                          scale: 0.86,
                          filter: "blur(12px)",
                        }
                  }
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          filter: "blur(0px)",
                        }
                  }
                  transition={{
                    duration: 0.7,
                    delay: 0.2 + index * 0.07,
                    ease: EASE,
                  }}
                  whileHover={
                    reduceMotion
                      ? undefined
                      : { y: -12, scale: 1.09, zIndex: 30 }
                  }
                >
                  <Link
                    href={`/equipment?category=${encodeURIComponent(card.category)}`}
                    className="group relative block h-full w-full"
                  >
                    <Image
                      src={card.imageUrl}
                      alt={`${card.label} rental equipment`}
                      fill
                      sizes="140px"
                      fallbackIcon={Package}
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                    {/* Card Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-2.5">
                      <p className="text-[10px] font-bold leading-tight text-white sm:text-[11px]">
                        {card.label}
                      </p>

                      <p className="mt-0.5 text-[8px] font-medium text-white/70">
                        {card.category}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Center Hero Content */}
          <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center px-4 pt-8 text-center sm:px-6 lg:pt-36 xl:pt-40">
            {/* Heading */}
            <motion.h1
              className="mt-0 max-w-3xl px-2 text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] text-slate-950 dark:text-white sm:text-5xl md:text-6xl md:mt-20 lg:text-[64px]"
              {...reveal(0.05)}
            >
              Rent Reliable Equipment
              <span className="mt-1 block text-[#6e13f9] dark:text-[#a66cff]">
                Anytime, Anywhere.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="mt-6 max-w-2xl px-4 text-sm font-medium leading-7 text-slate-600 dark:text-slate-400 sm:text-base sm:leading-8"
              {...reveal(0.16)}
            >
              Find excavators, forklifts, cranes, generators, concrete
              equipment, and professional site gear. Book what your project
              needs—or list your own equipment and start earning with rEntsy.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="mt-8 flex w-full flex-col items-center justify-center gap-3 px-4 sm:w-auto sm:flex-row sm:px-0"
              {...reveal(0.26)}
            >
              <Link
                href="/equipment"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#6e13f9] px-7 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#5b0ed6] sm:w-auto"
              >
                <span>Browse Equipment</span>

                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/dashboard/add-equipment"
                className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 bg-white/80 px-7 py-3.5 text-sm font-bold text-slate-800 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#6e13f9] hover:text-[#6e13f9] dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-[#8b45ff] dark:hover:text-[#a66cff] sm:w-auto"
              >
                List Your Fleet
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Feature Strip */}
        <motion.div
          className="relative z-10 mx-auto mt-4 grid max-w-5xl grid-cols-1 gap-0 border-t border-slate-200/80 pt-8 dark:border-slate-800 sm:grid-cols-3"
          initial={reduceMotion ? undefined : "hidden"}
          whileInView={reduceMotion ? undefined : "show"}
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.12 } },
          }}
        >
          {HERO_FEATURES.map((item, index) => {
            const dividerClass =
              index !== 0
                ? "border-t border-slate-200 sm:border-l sm:border-t-0 dark:border-slate-800"
                : "";
            const featureClasses = ["px-6 py-4 text-center sm:px-7", dividerClass]
              .join(" ")
              .trim();

            return (
              <motion.div
                key={item.title}
                className={featureClasses}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 18,
                    filter: "blur(6px)",
                  },
                  show: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: 0.55, ease: EASE },
                  },
                }}
              >
                <h2 className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                  {item.title}
                </h2>

                <p className="mx-auto mt-2 max-w-xs text-xs leading-6 text-slate-500 dark:text-slate-400 sm:text-sm">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
