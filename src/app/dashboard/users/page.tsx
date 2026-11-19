import type { Metadata } from "next";

import UsersClient from "@/components/dashboard/UsersClient";
import { requireRole } from "@/lib/dashboard-auth";

export const metadata: Metadata = {
  title: "Users — rEntsy Dashboard",
};

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const user = await requireRole(["admin"]);
  const params = await searchParams;

  return (
    <UsersClient
      currentUser={user}
      initialQuery={params.q || ""}
    />
  );
}
