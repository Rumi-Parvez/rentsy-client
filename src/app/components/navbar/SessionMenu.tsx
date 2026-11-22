"use client";

import { useState } from "react";
import Image from "@/components/ImageWithFallback";
import Link from "next/link";
import { HiArrowRightOnRectangle, HiUserCircle } from "react-icons/hi2";

import { clearTokenCache } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

type SessionUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

interface SessionMenuProps {
  variant?: "navbar" | "mobile";
  onAction?: () => void;
}

export default function SessionMenu({
  variant = "navbar",
  onAction,
}: SessionMenuProps) {
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user as SessionUser | undefined;

  const [imageError, setImageError] = useState(false);

  const handleSignOut = async () => {
    await authClient.signOut();
    clearTokenCache();
    onAction?.();
    window.location.href = "/";
  };

  if (isPending) {
    return (
      <div
        className={
          variant === "mobile"
            ? "h-11 w-full animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800"
            : "h-9 w-28 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800"
        }
      />
    );
  }

  /* ================= GUEST ================= */

  if (!user) {
    if (variant === "mobile") {
      return (
        <div className="flex flex-col gap-2.5">
          <Link
            href="/sign-in"
            onClick={onAction}
            className="flex min-h-11 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-[#6e13f9] hover:text-[#6e13f9] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
          >
            Sign In
          </Link>

          <Link
            href="/sign-up"
            onClick={onAction}
            className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-[#6e13f9] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5b0ed6]"
          >
            <span>Get Started</span>
            <HiArrowRightOnRectangle className="h-4 w-4" />
          </Link>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <Link
          href="/sign-in"
          className="inline-flex min-h-9 items-center justify-center rounded-full px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-[#6e13f9] dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-[#a66cff]"
        >
          Sign In
        </Link>

        <Link
          href="/sign-up"
          className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full bg-[#6e13f9] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#5b0ed6]"
        >
          <span>Get Started</span>
          <HiArrowRightOnRectangle className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  /* ================= SIGNED IN ================= */

  const displayName =
    user.name?.trim() || user.email?.split("@")[0] || "User";

  const firstLetter = displayName.charAt(0).toUpperCase();

  const hasProfileImage = Boolean(user.image) && !imageError;

  if (variant === "mobile") {
    return (
      <div className="flex flex-col gap-2">
        <Link
          href="/dashboard"
          onClick={onAction}
          className="flex min-h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-[#6e13f9] hover:text-[#6e13f9] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
        >
          <span className="flex items-center gap-2.5">
            <HiUserCircle className="h-5 w-5 text-[#6e13f9] dark:text-[#a66cff]" />
            <span>Dashboard</span>
          </span>

          <span className="text-xs text-slate-400">↗</span>
        </Link>

        <button
          type="button"
          onClick={handleSignOut}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400"
        >
          <HiArrowRightOnRectangle className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/dashboard"
        className="inline-flex min-h-9 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-[#6e13f9] hover:text-[#6e13f9] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#8b45ff]"
      >
        {hasProfileImage ? (
          <Image
            src={user.image!}
            alt={`${displayName}'s profile`}
            width={24}
            height={24}
            className="h-6 w-6 rounded-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#6e13f9] text-xs font-bold text-white">
            {firstLetter}
          </span>
        )}

        <span>Dashboard</span>
      </Link>

      <button
        type="button"
        onClick={handleSignOut}
        className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-[#6e13f9] px-3.5 py-1.5 text-sm font-semibold text-white transition hover:bg-[#5b0ed6]"
      >
        <HiArrowRightOnRectangle className="h-4 w-4" />
        <span>Sign Out</span>
      </button>
    </div>
  );
}
