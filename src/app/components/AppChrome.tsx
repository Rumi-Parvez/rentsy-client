"use client";

import { usePathname } from "next/navigation";

import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";

export default function AppChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isDashboard = pathname?.startsWith("/dashboard");
  const isAuthPage =
    pathname === "/sign-in" || pathname === "/sign-up";

  const hideChrome = isDashboard || isAuthPage;

  return (
    <>
      {!hideChrome && <Navbar />}
      {children}
      {!hideChrome && <Footer />}
    </>
  );
}
