import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import dns from 'node:dns';

import AppChrome from "./components/AppChrome";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
dns.setServers(['8.8.8.8', '8.8.4.4']);
export const metadata: Metadata = {
  title: "rEntsy — Equipment Rental Dashboard",
  description:
    "Role-based dashboard for customers, equipment owners and administrators on the rEntsy equipment rental platform.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
        <ThemeProvider>
          <AppChrome>{children}</AppChrome>
        </ThemeProvider>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--card)",
              color: "var(--card-foreground)",
              border: "1px solid var(--border)",
              fontSize: "13px",
            },
          }}
        />
      </body>
    </html>
  );
}
