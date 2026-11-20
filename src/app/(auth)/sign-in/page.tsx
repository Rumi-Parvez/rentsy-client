"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import logoImg from "../../assets/rEntsy-Photoroom.png";
import {
  signIn,
} from "@/lib/auth-client";

const CRANE_IMAGE_URL =
  "https://cdn.prod.website-files.com/6246d8c921709e497eef110f/67f550a672bb91ad04255caa_intermodal-container-tracking.jpg";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  // ----------------------------------------
  // Email Sign In
  // ----------------------------------------

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const cleanEmail =
      email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      toast.error(
        "Email and password are required."
      );
      return;
    }

    setLoading(true);

    try {
      const requestedRedirect =
        typeof window !== "undefined"
          ? new URLSearchParams(
              window.location.search
            ).get("redirect")
          : null;

      const isSafeRedirect =
        Boolean(requestedRedirect) &&
        requestedRedirect!.startsWith("/") &&
        !requestedRedirect!.startsWith("//");

      const redirectTo = isSafeRedirect
        ? requestedRedirect!
        : "/dashboard";

      const { error } =
        await signIn.email({
          email: cleanEmail,
          password,
          callbackURL: redirectTo,
        });

      if (error) {
        toast.error(
          error.message ||
            "Invalid email or password."
        );

        return;
      }

      toast.success(
        "Signed in successfully."
      );

      router.push(redirectTo);
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while signing in.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------
  // Google / GitHub
  // ----------------------------------------

  const handleSocialSignIn = async (
    provider: "google" | "github"
  ) => {
    setLoading(true);

    try {
      const requestedRedirect =
        typeof window !== "undefined"
          ? new URLSearchParams(
              window.location.search
            ).get("redirect")
          : null;

      const isSafeRedirect =
        Boolean(requestedRedirect) &&
        requestedRedirect!.startsWith("/") &&
        !requestedRedirect!.startsWith("//");

      const redirectTo = isSafeRedirect
        ? requestedRedirect!
        : "/dashboard";

      await signIn.social({
        provider,
        callbackURL: redirectTo,
      });
    } catch (error) {
      console.error(
        "Social sign-in error:",
        error
      );

      toast.error(
        `Failed to sign in with ${provider}.`
      );

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f5f7] p-3 transition-colors duration-200 dark:bg-slate-950 sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl grid-cols-1 overflow-hidden rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-12">

        {/* =====================================================
            LEFT LOGIN COLUMN
        ====================================================== */}

        <div className="flex flex-col justify-between p-6 sm:p-10 lg:col-span-6 xl:px-14 xl:py-10">

          {/* Logo */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2"
            >
              <Image
                src={logoImg}
                alt="rEntsy Logo"
                width={120}
                height={38}
                priority
                className="h-9 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Login Form */}
          <div className="mx-auto my-6 w-full max-w-md">

            {/* Heading */}
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-[32px]">
                Welcome Back
              </h1>

              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                Sign in to continue using your
                rEntsy account.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-4"
            >

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  placeholder="rumi@example.com"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#6e13f9] focus:ring-2 focus:ring-[#6e13f9]/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-[#8b45ff]"
                />
              </div>

              {/* Password */}
              <div>
                <div className="mb-1 flex items-center justify-between">

                  <label
                    htmlFor="password"
                    className="text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-[#6e13f9] transition hover:underline dark:text-[#a66cff]"
                  >
                    Forgot Password?
                  </Link>

                </div>

                <div className="relative">

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3.5 pr-10 text-sm text-slate-900 outline-none transition focus:border-[#6e13f9] focus:ring-2 focus:ring-[#6e13f9]/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-[#8b45ff]"
                  />

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      setShowPassword(
                        (prev) =>
                          !prev
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>

                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2">

                <input
                  id="remember"
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-slate-300 accent-[#6e13f9]"
                />

                <label
                  htmlFor="remember"
                  className="text-xs text-slate-500 dark:text-slate-400"
                >
                  Remember me
                </label>

              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#6e13f9] py-2.5 text-sm font-semibold text-white transition hover:bg-[#5b0ed6] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">

              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />

              <span className="text-xs text-slate-400">
                Or Sign In With
              </span>

              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />

            </div>

            {/* Social Login */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

              {/* Google */}
              <button
                type="button"
                disabled={loading}
                onClick={() =>
                  handleSocialSignIn(
                    "google"
                  )
                }
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/70"
              >
                <FcGoogle className="h-4 w-4 shrink-0" />

                <span>
                  Google
                </span>
              </button>

              {/* GitHub */}
              <button
                type="button"
                disabled={loading}
                onClick={() =>
                  handleSocialSignIn(
                    "github"
                  )
                }
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/70"
              >
                <FaGithub className="h-4 w-4 shrink-0 text-slate-900 dark:text-white" />

                <span>
                  GitHub
                </span>
              </button>

            </div>

            {/* Register */}
            <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
              {`Don't`} have an account?{" "}

              <Link
                href="/sign-up"
                className="font-semibold text-[#6e13f9] hover:underline dark:text-[#9b5cff]"
              >
                Create Account.
              </Link>
            </p>

          </div>

          {/* Footer */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-slate-400">

            <span>
              Copyright © 2026 rEntsy Equipment Rental.
            </span>

            <Link
              href="/privacy-policy"
              className="hover:text-[#6e13f9]"
            >
              Privacy Policy
            </Link>

          </div>

        </div>

        {/* =====================================================
            RIGHT SHOWCASE
        ====================================================== */}

        <div className="p-3 lg:col-span-6 lg:p-4">

          <div className="relative flex h-full min-h-[360px] w-full flex-col justify-between overflow-hidden rounded-2xl bg-[#6e13f9] p-6 text-white sm:p-8 lg:p-10">

            {/* Equipment Image */}
            <Image
              src={CRANE_IMAGE_URL}
              alt="Heavy construction equipment rental"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="object-cover object-center"
            />

            {/* Image Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#380794]/95 via-[#6e13f9]/70 to-[#6e13f9]/55" />

            {/* Main Content */}
            <div className="relative z-10 max-w-md">

              <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-xs">
                rEntsy Equipment Marketplace
              </span>

              <h2 className="mt-3 text-2xl font-bold leading-snug tracking-tight sm:text-3xl lg:text-[34px]">
                Your equipment rental,
                right on track.
              </h2>

              <p className="mt-2.5 text-sm leading-relaxed text-purple-100">
                Access construction equipment,
                trucks, machinery, and professional
                gear through the rEntsy rental
                marketplace.
              </p>

            </div>

            {/* Bottom Info */}
            <div className="relative z-10 mt-8 rounded-xl border border-white/20 bg-black/25 p-4 backdrop-blur-md">

              <p className="text-xs font-semibold uppercase tracking-wider text-purple-200">
                Welcome to rEntsy
              </p>

              <p className="mt-1 text-sm text-white">
                Book the equipment you need or
                manage your own rental fleet from
                one platform.
              </p>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}