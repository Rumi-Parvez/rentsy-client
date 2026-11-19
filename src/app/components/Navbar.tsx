"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  HiBars3,
  HiChevronDown,
  HiXMark,
} from "react-icons/hi2";

import logoImg from "../../app/assets/rEntsy-Photoroom.png";

import SessionMenu from "./navbar/SessionMenu";
import ThemeToggle from "./navbar/ThemeToggle";

const marketplaceLinks = [
  {
    label: "Browse Equipment",
    href: "/equipment",
  },
  {
    label: "Categories",
    href: "/categories",
  },
  {
    label: "How It Works",
    href: "/how-it-works",
  },
];

const businessLinks = [
  {
    label: "List Equipment",
    href: "/list-equipment",
  },
  {
    label: "Become an Owner",
    href: "/become-an-owner",
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const [activeDropdown, setActiveDropdown] = useState<
    "marketplace" | "business" | null
  >(null);

  const navbarRef = useRef<HTMLElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Close menus with Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveDropdown(null);
        setMobileOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const toggleDropdown = (
    dropdown: "marketplace" | "business",
  ) => {
    setActiveDropdown((current) =>
      current === dropdown ? null : dropdown,
    );
  };

  const closeAllMenus = () => {
    setActiveDropdown(null);
    setMobileOpen(false);
  };

  return (
    <header
      ref={navbarRef}
      className="sticky top-0 z-[100] w-full border-b border-slate-200/80 bg-white/95 text-slate-900 backdrop-blur-xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/95 dark:text-white"
    >
      {/* Main Navbar */}
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-8 lg:px-10">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeAllMenus}
          className="flex shrink-0 items-center"
        >
          <Image
            src={logoImg}
            alt="rEntsy"
            width={125}
            height={40}
            priority
            className="h-9 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center lg:flex">
          {/* Marketplace */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown("marketplace")}
              aria-expanded={activeDropdown === "marketplace"}
              className="flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-[#6e13f9] dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-[#a66cff]"
            >
              Marketplace
              <HiChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  activeDropdown === "marketplace" ? "rotate-180" : ""
                }`}
              />
            </button>

            {activeDropdown === "marketplace" && (
              <DropdownMenu
                links={marketplaceLinks}
                onClose={() => setActiveDropdown(null)}
              />
            )}
          </div>

          {/* For Business */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown("business")}
              aria-expanded={activeDropdown === "business"}
              className="flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-[#6e13f9] dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-[#a66cff]"
            >
              For Business
              <HiChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  activeDropdown === "business" ? "rotate-180" : ""
                }`}
              />
            </button>

            {activeDropdown === "business" && (
              <DropdownMenu
                links={businessLinks}
                onClose={() => setActiveDropdown(null)}
              />
            )}
          </div>

          {/* About */}
          <Link
            href="/about"
            onClick={() => setActiveDropdown(null)}
            className="rounded-full px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-[#6e13f9] dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-[#a66cff]"
          >
            About
          </Link>

          {/* Contact */}
          <Link
            href="/contact"
            onClick={() => setActiveDropdown(null)}
            className="rounded-full px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-[#6e13f9] dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-[#a66cff]"
          >
            Contact
          </Link>
        </nav>

        {/* Desktop Right Side */}
        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <SessionMenu variant="navbar" />
        </div>

        {/* Mobile Right Side */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />

          <button
            type="button"
            onClick={() => {
              setMobileOpen((current) => !current);
              setActiveDropdown(null);
            }}
            aria-label={
              mobileOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={mobileOpen}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors duration-200 hover:border-[#6e13f9] hover:text-[#6e13f9] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#8b45ff] dark:hover:text-[#a66cff]"
          >
            {mobileOpen ? (
              <HiXMark className="h-5 w-5" />
            ) : (
              <HiBars3 className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="max-h-[calc(100vh-72px)] overflow-y-auto border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-8">
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {/* Marketplace */}
              <div className="py-1">
                <MobileDropdown
                  title="Marketplace"
                  isOpen={activeDropdown === "marketplace"}
                  onToggle={() => toggleDropdown("marketplace")}
                  links={marketplaceLinks}
                  onLinkClick={closeAllMenus}
                />
              </div>

              {/* Business */}
              <div className="py-1">
                <MobileDropdown
                  title="For Business"
                  isOpen={activeDropdown === "business"}
                  onToggle={() => toggleDropdown("business")}
                  links={businessLinks}
                  onLinkClick={closeAllMenus}
                />
              </div>

              {/* About */}
              <div className="py-1">
                <MobileLink href="/about" onClick={closeAllMenus}>
                  About rEntsy
                </MobileLink>
              </div>

              {/* Contact */}
              <div className="py-1">
                <MobileLink href="/contact" onClick={closeAllMenus}>
                  Contact
                </MobileLink>
              </div>

              {/* FAQ */}
              <div className="py-1">
                <MobileLink href="/faq" onClick={closeAllMenus}>
                  FAQ
                </MobileLink>
              </div>
            </div>

            {/* Mobile Session (Direct links / buttons, no profile card) */}
            <div className="mt-4 pt-2">
              <SessionMenu
                variant="mobile"
                onAction={closeAllMenus}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/* =========================================================
   DESKTOP DROPDOWN
========================================================= */

function DropdownMenu({
  links,
  onClose,
}: {
  links: {
    label: string;
    href: string;
  }[];
  onClose: () => void;
}) {
  return (
    <div className="absolute left-1/2 top-[52px] z-[110] w-64 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onClose}
          className="block rounded-xl px-3 py-3 text-sm text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-[#6e13f9] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-[#a66cff]"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}

/* =========================================================
   MOBILE DROPDOWN
========================================================= */

function MobileDropdown({
  title,
  isOpen,
  onToggle,
  links,
  onLinkClick,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  links: {
    label: string;
    href: string;
  }[];
  onLinkClick: () => void;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-800 transition-colors duration-200 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
      >
        <span>{title}</span>

        <HiChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#6e13f9]" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="mb-2 ml-3 mt-1 space-y-1 border-l border-slate-200 pl-3 dark:border-slate-800">
          {links.map((link) => (
            <MobileLink
              key={link.href}
              href={link.href}
              onClick={onLinkClick}
            >
              {link.label}
            </MobileLink>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   MOBILE LINK
========================================================= */

function MobileLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-100 hover:text-[#6e13f9] dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-[#a66cff]"
    >
      <span>{children}</span>
      <span className="text-xs text-slate-400">↗</span>
    </Link>
  );
}