import type { LucideIcon } from "lucide-react";
import {
  CalendarCheck,
  ClipboardList,
  Heart,
  LayoutDashboard,
  Package,
  PackagePlus,
  Tags,
  UserRound,
  UsersRound,
} from "lucide-react";

import type { UserRole } from "@/types/dashboard";

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
  badgeKey?: "pending" | "active";
}

export interface DashboardNavSection {
  title: string;
  items: DashboardNavItem[];
}

export function getDashboardNav(
  role: UserRole
): DashboardNavSection[] {
  const account: DashboardNavSection = {
    title: "Account",
    items: [
      {
        label: "My Profile",
        href: "/dashboard/profile",
        icon: UserRound,
      },
    ],
  };

  if (role === "admin") {
    return [
      {
        title: "Overview",
        items: [
          {
            label: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
            exact: true,
          },
        ],
      },
      {
        title: "Administration",
        items: [
          {
            label: "All Users",
            href: "/dashboard/users",
            icon: UsersRound,
          },
          {
            label: "All Equipment",
            href: "/dashboard/equipment",
            icon: Package,
          },
          {
            label: "Categories",
            href: "/dashboard/categories",
            icon: Tags,
          },
          {
            label: "All Rentals",
            href: "/dashboard/rentals",
            icon: ClipboardList,
          },
        ],
      },
      account,
    ];
  }

  if (role === "owner") {
    return [
      {
        title: "Overview",
        items: [
          {
            label: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
            exact: true,
          },
        ],
      },
      {
        title: "Fleet",
        items: [
          {
            label: "Add Equipment",
            href: "/dashboard/add-equipment",
            icon: PackagePlus,
          },
          {
            label: "My Equipment",
            href: "/dashboard/equipment",
            icon: Package,
          },
          {
            label: "Categories",
            href: "/dashboard/categories",
            icon: Tags,
          },
          {
            label: "My Rentals",
            href: "/dashboard/rentals",
            icon: CalendarCheck,
          },
        ],
      },
      account,
    ];
  }

  return [
    {
      title: "Overview",
      items: [
        {
          label: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
          exact: true,
        },
      ],
    },
    {
      title: "Rental activity",
      items: [
        {
          label: "My Rentals",
          href: "/dashboard/rentals",
          icon: CalendarCheck,
        },
        {
          label: "Favorites",
          href: "/dashboard/favorites",
          icon: Heart,
        },
      ],
    },
    account,
  ];
}

export const roleAccent: Record<
  UserRole,
  {
    label: string;
    badge: string;
    avatar: string;
    gradient: string;
  }
> = {
  admin: {
    label: "Administrator",
    badge:
      "bg-violet-50 text-violet-700 ring-violet-600/20 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-400/20",
    avatar:
      "from-violet-500 via-purple-500 to-fuchsia-500",
    gradient:
      "from-[#4c0fb8] via-[#6e13f9] to-[#9a4dff]",
  },
  owner: {
    label: "Equipment owner",
    badge:
      "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20",
    avatar:
      "from-emerald-500 via-teal-500 to-cyan-500",
    gradient:
      "from-[#0f766e] via-[#0d9488] to-[#22c55e]",
  },
  customer: {
    label: "Customer",
    badge:
      "bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-400/20",
    avatar:
      "from-sky-500 via-blue-500 to-indigo-500",
    gradient:
      "from-[#1d4ed8] via-[#2563eb] to-[#38bdf8]",
  },
};
