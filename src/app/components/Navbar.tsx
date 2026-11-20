"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  HiBars3,
  HiXMark,
} from "react-icons/hi2";

import logoImg from "../../app/assets/rEntsy-Photoroom.png";

import SessionMenu from "./navbar/SessionMenu";
import ThemeToggle from "./navbar/ThemeToggle";

const navLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Equipment",
    href: "/equipment",
  },
  {
    label: "How It's Work",
    href: "/#how-it-works",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navbarRef = useRef<HTMLElement | null>(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target as Node)
      ) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Close mobile menu with Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
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

  const closeAllMenus = () => {
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
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeAllMenus}
              className="rounded-full px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-[#6e13f9] dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-[#a66cff]"
            >
              {link.label}
            </Link>
          ))}
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
            onClick={() => setMobileOpen((current) => !current)}
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
              {navLinks.map((link) => (
                <div key={link.href} className="py-1">
                  <MobileLink href={link.href} onClick={closeAllMenus}>
                    {link.label}
                  </MobileLink>
                </div>
              ))}
            </div>

            {/* Mobile Session */}
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