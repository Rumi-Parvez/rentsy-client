"use client";

import Image from "@/components/ImageWithFallback";
import Link from "next/link";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import { HiArrowUpRight } from "react-icons/hi2";

import logoImg from "../../app/assets/rEntsy-Photoroom.png";

const marketplaceLinks = [
  { label: "Browse Equipment", href: "/equipment" },
  { label: "Categories", href: "/categories" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Rental Process", href: "/rental-process" },

];

const businessLinks = [
  { label: "List Equipment", href: "/dashboard/add-equipment" },
  { label: "Owner Dashboard", href: "/dashboard/equipment" },
  { label: "Manage Bookings", href: "/dashboard/rentals" },
  { label: "My Profile", href: "/dashboard/profile" },
  { label: "Become an Owner", href: "/sign-up" },
];

const companyLinks = [
  { label: "About rEntsy", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "FAQ", href: "/faq" },
  { label: "Careers", href: "/careers" },
  { label: "Support", href: "/support" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Cookie Policy", href: "/cookie-policy" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-900 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950 dark:text-white">

      {/* ==================== MAIN FOOTER ==================== */}

      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-16">

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">

          {/* ==================== BRAND ==================== */}

          <div className="lg:col-span-4 lg:pr-10">

            <Link
              href="/"
              className="inline-flex items-center"
            >
              <Image
                src={logoImg}
                alt="rEntsy"
                width={125}
                height={40}
                className="h-9 w-auto object-contain"
              />
            </Link>

            <h2 className="mt-7 max-w-sm text-2xl font-semibold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              The smarter way to
              <br />

              <span className="text-[#6e13f9]">
                rent equipment.
              </span>
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
              Find reliable equipment, book with confidence,
              and manage your rentals from one simple
              marketplace.
            </p>

            <Link
              href="/equipment"
              className="group mt-7 inline-flex items-center gap-2 border border-[#6e13f9] bg-[#6e13f9] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5c0fd3]"
            >
              Explore Equipment

              <HiArrowUpRight
                className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>

          </div>

          {/* ==================== LINK COLUMNS ==================== */}

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:col-span-8">

            {/* Marketplace */}

            <FooterColumn
              title="Marketplace"
              links={marketplaceLinks}
            />

            {/* Business */}

            <FooterColumn
              title="For Business"
              links={businessLinks}
            />

            {/* Company */}

            <FooterColumn
              title="Company"
              links={companyLinks}
            />

            {/* Connect */}

            <div>

              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-900 dark:text-white">
                Connect
              </h3>

              <div className="mt-5 space-y-3.5">

                <SocialLink
                  href="https://x.com"
                  icon={<FaTwitter />}
                  label="X / Twitter"
                />

                <SocialLink
                  href="https://instagram.com"
                  icon={<FaInstagram />}
                  label="Instagram"
                />

                <SocialLink
                  href="https://facebook.com"
                  icon={<FaFacebookF />}
                  label="Facebook"
                />

                <SocialLink
                  href="https://linkedin.com"
                  icon={<FaLinkedinIn />}
                  label="LinkedIn"
                />

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ==================== BOTTOM BAR ==================== */}

      <div className="border-t border-slate-200 dark:border-slate-800">

        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-5 text-[11px] text-slate-500 dark:text-slate-400 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">

          {/* Legal */}

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">

            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors duration-200 hover:text-[#6e13f9] dark:hover:text-[#a66cff]"
              >
                {link.label}
              </Link>
            ))}

          </div>

          {/* Copyright */}

          <p className="order-3 lg:order-2">
            © {new Date().getFullYear()} rEntsy. All rights reserved.
          </p>


         

        </div>

      </div>

    </footer>
  );
}


/* =========================================================
   FOOTER COLUMN
========================================================= */

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
}) {
  return (
    <div>

      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-900 dark:text-white">
        {title}
      </h3>

      <div className="mt-5 space-y-3.5">

        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block text-xs text-slate-500 transition-colors duration-200 hover:text-[#6e13f9] dark:text-slate-400 dark:hover:text-[#a66cff]"
          >
            {link.label}
          </Link>
        ))}

      </div>

    </div>
  );
}


/* =========================================================
   SOCIAL LINK
========================================================= */

function SocialLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2.5 text-xs text-slate-500 transition-colors duration-200 hover:text-[#6e13f9] dark:text-slate-400 dark:hover:text-[#a66cff]"
    >

      <span className="flex h-5 w-5 items-center justify-center text-[13px]">
        {icon}
      </span>

      <span>
        {label}
      </span>

    </a>
  );
}
