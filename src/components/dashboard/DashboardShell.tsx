"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { RiHome5Fill } from "react-icons/ri";

import logoImg from "../../app/assets/rEntsy-Photoroom.png"

import {
  ArrowUpRight,
  Bell,

  ChevronDown,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  UserRound,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import { Avatar } from "@/components/dashboard/Avatar";
import ThemeToggle from "@/app/components/navbar/ThemeToggle";
import { authClient } from "@/lib/auth-client";
import {
  clearTokenCache,
  getErrorMessage,
} from "@/lib/api";
import { readCookie, writeCookie } from "@/lib/preferences";
import {
  getDashboardNav,
  roleAccent,
} from "@/lib/dashboard-nav";
import { roleLabel } from "@/lib/format";
import type { DashboardUser } from "@/types/dashboard";
import { cn } from "@/lib/utils";
import Image from "@/components/ImageWithFallback";


const SIDEBAR_KEY = "rentsy-dashboard-sidebar-collapsed";

export default function DashboardShell({
  user,
  children,
}: {
  user: DashboardUser;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return readCookie(SIDEBAR_KEY) === "true";
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [signingOut, setSigningOut] = useState(false);
  const [previousPathname, setPreviousPathname] = useState(pathname);

  if (pathname !== previousPathname) {
    setPreviousPathname(pathname);
    setMobileOpen(false);
    setProfileOpen(false);
    setNotificationsOpen(false);
    setMobileSearch(false);
  }

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const nav = getDashboardNav(user.role);
  const accent = roleAccent[user.role];

  const searchTarget =
    user.role === "admin"
      ? "/dashboard/users"
      : user.role === "owner"
        ? "/dashboard/equipment"
        : "/dashboard/rentals";

  const notificationLinks =
    user.role === "admin"
      ? [
          {
            label: "Review pending equipment",
            href: "/dashboard/equipment?status=pending",
          },
          {
            label: "Approve category requests",
            href: "/dashboard/categories",
          },
          {
            label: "Manage all rentals",
            href: "/dashboard/rentals",
          },
          {
            label: "Manage user roles",
            href: "/dashboard/users",
          },
        ]
      : user.role === "owner"
        ? [
            {
              label: "Respond to rental requests",
              href: "/dashboard/rentals",
            },
            {
              label: "Update your equipment",
              href: "/dashboard/equipment",
            },
          ]
        : [
            {
              label: "Track your rentals",
              href: "/dashboard/rentals",
            },
            {
              label: "Browse your favorites",
              href: "/dashboard/favorites",
            },
          ];

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Click outside dropdowns.
  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        profileRef.current &&
        !profileRef.current.contains(target)
      ) {
        setProfileOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(target)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((current) => {
      const next = !current;
      writeCookie(SIDEBAR_KEY, String(next));
      return next;
    });
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();

    const query = search.trim();

    router.push(
      query
        ? `${searchTarget}?q=${encodeURIComponent(query)}`
        : searchTarget
    );

    setSearch("");
    setMobileSearch(false);
  };

  const handleSignOut = async () => {
    setSigningOut(true);

    try {
      await authClient.signOut();
      clearTokenCache();
      toast.success("Signed out.");
      router.push("/sign-in");
      router.refresh();
    } catch (error) {
      toast.error(getErrorMessage(error));
      setSigningOut(false);
    }
  };

  const isActive = (href: string, exact?: boolean) => {
    const target = href.split("?")[0];

    if (exact) {
      return pathname === target;
    }

    return (
      pathname === target ||
      pathname?.startsWith(`${target}/`)
    );
  };

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-[#f5f5fa] text-foreground transition-colors duration-300 dark:bg-[#08080d]">
      <div
        className={cn(
          "mx-auto grid min-h-screen w-full max-w-[1800px]",
          collapsed
            ? "lg:grid-cols-[92px_minmax(0,1fr)]"
            : "lg:grid-cols-[272px_minmax(0,1fr)]"
        )}
      >
        {/* ================= DESKTOP SIDEBAR ================= */}
        <aside
          className={cn(
            "sticky top-0 hidden h-screen border-r border-border/70 bg-card lg:flex lg:flex-col",
            collapsed ? "items-stretch" : ""
          )}
        >
          <SidebarContent
            user={user}
            collapsed={collapsed}
            nav={nav}
            accent={accent}
            pathname={pathname || ""}
            isActive={isActive}
            onToggle={toggleCollapsed}
            onSignOut={handleSignOut}
            signingOut={signingOut}
          />
        </aside>

        {/* ================= MOBILE DRAWER ================= */}
        <div
          className={cn(
            "fixed inset-0 z-[150] lg:hidden",
            mobileOpen ? "visible" : "invisible"
          )}
          aria-hidden={!mobileOpen}
        >
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "absolute inset-0 bg-slate-950/50 backdrop-blur-[2px] transition-opacity duration-200",
              mobileOpen ? "opacity-100" : "opacity-0"
            )}
          />

          <aside
            className={cn(
              "relative flex h-full w-[290px] max-w-[86vw] flex-col border-r border-border bg-card shadow-2xl transition-transform duration-250",
              mobileOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <SidebarContent
              user={user}
              collapsed={false}
              nav={nav}
              accent={accent}
              pathname={pathname || ""}
              isActive={isActive}
              onSignOut={handleSignOut}
              signingOut={signingOut}
            />
          </aside>
        </div>

        {/* ================= MAIN COLUMN ================= */}
        <div className="flex min-h-screen min-w-0 flex-col">
          <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
            <div className="flex h-[68px] items-center gap-3 px-4 sm:px-6 lg:px-8">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:text-foreground lg:hidden"
              >
                <Menu className="h-4 w-4" />
              </button>

              <form
                onSubmit={handleSearch}
                className="relative hidden max-w-md flex-1 sm:block"
              >
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={
                    user.role === "admin"
                      ? "Search users, equipment, rentals..."
                      : user.role === "owner"
                        ? "Search your equipment..."
                        : "Search your rentals..."
                  }
                  className="h-10 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-xs text-foreground outline-none transition placeholder:text-muted-foreground/80 focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
                />
              </form>

              <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
                <span>
                  <Link href='/' >
              <RiHome5Fill className="text-2xl text-purple-700 dark:text-white/80" />

              </Link>
                </span>
                <button
                  type="button"
                  onClick={() => setMobileSearch((current) => !current)}
                  aria-label="Search"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition hover:text-foreground sm:hidden"
                >
                  <Search className="h-4 w-4" />
                </button>

                

                <ThemeToggle />

                <div className="relative" ref={notificationRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setNotificationsOpen((current) => !current);
                      setProfileOpen(false);
                    }}
                    aria-label="Notifications"
                    className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition hover:text-foreground"
                  >
                    <Bell className="h-4 w-4" />
                    <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary ring-2 ring-card" />
                  </button>

                  {notificationsOpen && (
                    <div className="absolute right-0 top-11 z-50 w-[290px] overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
                      <div className="border-b border-border px-4 py-3">
                        <p className="text-sm font-semibold text-foreground">
                          Notifications
                        </p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          Quick links for {roleLabel(user.role)} accounts
                        </p>
                      </div>

                      <div className="p-2">
                        {notificationLinks.map((link) => (
                          <Link
                            key={link.href + link.label}
                            href={link.href}
                            onClick={() =>
                              setNotificationsOpen(false)
                            }
                            className="group flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                          >
                            <span>{link.label}</span>
                            <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
                          </Link>
                        ))}
                      </div>

                      <div className="border-t border-border px-4 py-3 text-[11px] text-muted-foreground">
                        You are all caught up.
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative" ref={profileRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen((current) => !current);
                      setNotificationsOpen(false);
                    }}
                    aria-label="Open account menu"
                    className="flex items-center gap-2 rounded-full border border-border bg-card p-1 pr-2 transition hover:border-primary/30 sm:pr-3"
                  >
                    <Avatar
                      name={user.name}
                      src={user.image}
                      size="sm"
                      className="ring-0"
                    />
                    <span className="hidden max-w-[110px] truncate text-xs font-semibold text-foreground sm:block">
                      {user.name.split(" ")[0]}
                    </span>
                    <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
                      <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
                        <Avatar
                          name={user.name}
                          src={user.image}
                          size="md"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {user.name}
                          </p>
                          <p className="truncate text-[11px] text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <div className="p-1.5">
                        <Link
                          href="/dashboard/profile"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        >
                          <UserRound className="h-4 w-4" />
                          My profile
                        </Link>

                        <Link
                          href="/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Link>
                      </div>

                      <div className="border-t border-border p-1.5">
                        <button
                          type="button"
                          onClick={handleSignOut}
                          disabled={signingOut}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60 dark:text-rose-400 dark:hover:bg-rose-500/10"
                        >
                          <LogOut className="h-4 w-4" />
                          {signingOut ? "Signing out..." : "Sign out"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {mobileSearch && (
              <form
                onSubmit={handleSearch}
                className="border-t border-border/70 px-4 pb-3 pt-2.5 sm:hidden"
              >
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    autoFocus
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search..."
                    className="h-10 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-xs text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
                  />
                </div>
              </form>
            )}
          </header>

          <main className="mx-auto min-w-0 w-full max-w-[1440px] flex-1 px-3 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
            {children}
          </main>

          <footer className="border-t border-border/60 px-4 py-4 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-[1440px] flex-col gap-1.5 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <span>
                © {new Date().getFullYear()} rEntsy Equipment Rental.
              </span>
              <span className="capitalize">
                Signed in as {roleLabel(user.role)}
              </span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SIDEBAR CONTENT
========================================================= */

function SidebarContent({
  user,
  collapsed,
  nav,
  accent,
  pathname,
  isActive,
  onToggle,
  onSignOut,
  signingOut,
}: {
  user: DashboardUser;
  collapsed: boolean;
  nav: ReturnType<typeof getDashboardNav>;
  accent: (typeof roleAccent)["admin"];
  pathname: string;
  isActive: (href: string, exact?: boolean) => boolean;
  onToggle?: () => void;
  onSignOut: () => void;
  signingOut: boolean;
}) {
  return (
    <>
      <div
        className={cn(
          "flex h-[68px] shrink-0 items-center border-b border-border/60",
          collapsed ? "justify-center px-3" : "px-5"
        )}
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 overflow-hidden"
        >
          <Image
            src={logoImg}
            alt="rEntsy"
            width={125}
            height={40}
            priority
            className="h-9 w-auto object-contain"
          />

          {!collapsed && (
            <span className="min-w-0 flex items-center gap-3">
              <span className="mt-1 text-black dark:text-white block text-[15px] font-bold uppercase tracking-[0.18em] ">
                {user.role}
              </span>
              
            </span>
          )}
        </Link>
      </div>

      <div
        className={cn(
          "shrink-0 border-b border-border/60 py-3",
          collapsed ? "px-2.5" : "px-3"
        )}
      >
        <Link
          href="/dashboard/profile"
          title={collapsed ? user.name : undefined}
          className={cn(
            "flex items-center gap-2.5 rounded-xl border border-border/70 bg-background/60 p-2 transition hover:border-primary/30",
            collapsed && "justify-center border-transparent bg-transparent"
          )}
        >
          <Avatar
            name={user.name}
            src={user.image}
            size="md"
            className="ring-0"
          />

          {!collapsed && (
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-semibold text-foreground">
                {user.name}
              </span>
              <span
                className={cn(
                  "mt-1 inline-flex rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide ring-1 ring-inset",
                  accent.badge
                )}
              >
                {accent.label}
              </span>
            </span>
          )}
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-5">
          {nav.map((section) => (
            <div key={section.title}>
              {!collapsed && (
                <p className="mb-1.5 px-2.5 text-[15px] font-bold   text-muted-foreground/95">
                  {section.title}
                </p>
              )}

              <div className="space-y-1">
                {section.items.map((item) => {
                  const active = isActive(item.href, item.exact);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={`${section.title}-${item.href}-${item.label}`}
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-[13px] font-medium transition",
                        collapsed && "justify-center px-0",
                        active
                          ? "bg-primary/10 text-primary dark:bg-primary/15 dark:text-[#c4a4ff]"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {active && (
                        <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-primary" />
                      )}

                      <Icon
                        className={cn(
                          "h-[17px] w-[17px] shrink-0",
                          active
                            ? "text-primary dark:text-[#c4a4ff]"
                            : "text-muted-foreground/80 group-hover:text-foreground"
                        )}
                      />

                      {!collapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      <div className="shrink-0 border-t border-border/60 p-3">
        {!collapsed && (
          <div className="mb-3 rounded-xl bg-gradient-to-br from-[#241052] via-[#4c139f] to-[#6e13f9] p-3.5 text-white">
            <div className="flex items-center gap-2">
              <LifeBuoy className="h-4 w-4" />
              <p className="text-xs font-semibold">Need a hand?</p>
            </div>
            <p className="mt-1 text-[10px] leading-4 text-purple-100">
              Our rental support team is available to help you
              manage listings, bookings and payments.
            </p>
            <Link
              href="/contact"
              className="mt-2.5 inline-flex h-7 items-center justify-center rounded-md bg-white px-3 text-[10px] font-bold text-[#3b0c8f] transition hover:bg-purple-50"
            >
              Contact support
            </Link>
          </div>
        )}

        <div
          className={cn(
            "flex items-center gap-1",
            collapsed ? "flex-col" : "justify-between"
          )}
        >
          {onToggle && (
            <button
              type="button"
              onClick={onToggle}
              title={
                collapsed ? "Expand sidebar" : "Collapse sidebar"
              }
              className={cn(
                "flex h-8 items-center gap-2 rounded-lg px-2 text-[11px] font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
                collapsed ? "w-8 justify-center px-0" : "flex-1"
              )}
            >
              {collapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <>
                  <PanelLeftClose className="h-4 w-4" />
                  Collapse
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={onSignOut}
            disabled={signingOut}
            title="Sign out"
            className={cn(
              "flex h-8 items-center justify-center gap-2 rounded-lg px-2 text-[11px] font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60 dark:text-rose-400 dark:hover:bg-rose-500/10",
              collapsed ? "w-8 px-0" : "flex-1"
            )}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && "Sign out"}
          </button>
        </div>
      </div>
    </>
  );
}
