import type { Metadata } from "next";

import EquipmentClient from "@/components/dashboard/EquipmentClient";
import { requireRole } from "@/lib/dashboard-auth";

export const metadata: Metadata = {
  title: "Equipment — rEntsy Dashboard",
};

export default async function EquipmentPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const user = await requireRole(["owner", "admin"]);
  const params = await searchParams;

  return (
    <EquipmentClient
      user={user}
      initialQuery={params.q || ""}
      initialStatus={params.status || ""}
    />
  );
}
