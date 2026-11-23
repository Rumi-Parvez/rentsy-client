import type { Metadata } from "next";

import ProfileClient from "@/components/dashboard/ProfileClient";
import { getDashboardUser } from "@/lib/dashboard-auth";

export const metadata: Metadata = {
  title: "My profile — rEntsy Dashboard",
};

export default async function ProfilePage() {
  const user = await getDashboardUser();

  return <ProfileClient user={user} />;
}
