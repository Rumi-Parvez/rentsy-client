import type { Metadata } from "next";

import FavoritesClient from "@/components/dashboard/FavoritesClient";
import { requireRole } from "@/lib/dashboard-auth";

export const metadata: Metadata = {
  title: "Favorites — rEntsy Dashboard",
};

export default async function FavoritesPage() {
  await requireRole(["customer"]);

  return <FavoritesClient />;
}
