import type { Metadata } from "next";

import DashboardOverview from "@/components/dashboard/DashboardOverview";
import { requireDashboardUser } from "@/lib/dashboard-auth";

export const metadata: Metadata = {
  title: "Overview — rEntsy Dashboard",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ denied?: string }>;
}) {
  const params = await searchParams;
  const user = await requireDashboardUser();

  const today = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(new Date());

  return (
    <DashboardOverview
      user={user}
      today={today}
      denied={params.denied === "1"}
    />
  );
}
