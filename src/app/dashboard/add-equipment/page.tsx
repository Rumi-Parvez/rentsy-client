import type { Metadata } from "next";

import AddEquipmentClient from "@/components/dashboard/AddEquipmentClient";
import { requireRole } from "@/lib/dashboard-auth";

export const metadata: Metadata = {
  title: "Add equipment — rEntsy Dashboard",
};

export default async function AddEquipmentPage() {
  const user = await requireRole(["owner", "admin"]);

  return <AddEquipmentClient user={user} />;
}
