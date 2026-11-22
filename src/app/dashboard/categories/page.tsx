import type { Metadata } from "next";

import CategoriesClient from "@/components/dashboard/CategoriesClient";
import { requireRole } from "@/lib/dashboard-auth";

export const metadata: Metadata = {
  title: "Categories — rEntsy Dashboard",
};

export default async function CategoriesPage() {
  const user = await requireRole(["owner", "admin"]);

  return <CategoriesClient user={user} />;
}
