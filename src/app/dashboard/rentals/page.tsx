import type { Metadata } from "next";

import RentalsClient from "@/components/dashboard/RentalsClient";
import { requireDashboardUser } from "@/lib/dashboard-auth";

export const metadata: Metadata = {
  title: "Rentals — rEntsy Dashboard",
};

export default async function RentalsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const user = await requireDashboardUser();
  const params = await searchParams;

  return (
    <RentalsClient user={user} initialQuery={params.q || ""} />
  );
}
