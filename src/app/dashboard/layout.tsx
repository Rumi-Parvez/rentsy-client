import type { Metadata } from "next";

import DashboardShell from "@/components/dashboard/DashboardShell";
import { requireDashboardUser } from "@/lib/dashboard-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard — rEntsy",
  description:
    "Role-based workspace for customers, equipment owners and administrators.",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireDashboardUser();

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
