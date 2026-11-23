"use client";

import React, { useState } from "react";
import Link from "next/link";

import Image from "@/components/ImageWithFallback";

import {
  Eye,
  EyeOff,
  Truck,
  UserCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import logoImg from "../../assets/rEntsy-Photoroom.png";

import {
  signIn,
  signUp,
} from "@/lib/auth-client";

type SignUpRole = "customer" | "owner";

const CRANE_IMAGE_URL =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTk5iCFNqhjCZQXBgZ64B_J9bBtvZPqnnWt67SBUSezz8XuUNIBCnxNuGd0&s=10";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer" as SignUpRole,
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  // =====================================================
  // Input Change
  // =====================================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // Role Selection
  // =====================================================

  const handleRoleSelect = (
    selectedRole: SignUpRole
  ) => {
    setFormData((prev) => ({
      ...prev,
      role: selectedRole,
    }));
  };

  // =====================================================
  // Email Registration
  // =====================================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const cleanName =
      formData.name.trim();

    const cleanEmail =
      formData.email.trim().toLowerCase();

    // =================================================
    // Validation
    // =================================================

    if (
      !cleanName ||
      !cleanEmail ||
      !formData.password
    ) {
      toast.error(
        "Name, email, and password are required."
      );
      return;
    }

    if (
      formData.password.length < 6
    ) {
      toast.error(
        "Password must be at least 6 characters long."
      );
      return;
    }

    if (
      !/[A-Z]/.test(
        formData.password
      )
    ) {
      toast.error(
        "Password must contain at least one uppercase letter."
      );
      return;
    }

    if (
      !/[a-z]/.test(
        formData.password
      )
    ) {
      toast.error(
        "Password must contain at least one lowercase letter."
      );
      return;
    }

    setLoading(true);

    try {
      // =================================================
      // 1. Create Better Auth Account
      // =================================================

      const { data, error } =
        await signUp.email({
          name: cleanName,
          email: cleanEmail,
          password:
            formData.password,
        });

      if (error) {
        toast.error(
          error.message ||
            "Failed to create account."
        );

        return;
      }

      if (!data?.user) {
        toast.error(
          "Account creation failed."
        );

        return;
      }

      // =================================================
      // 3. Success
      // =================================================

      toast.success("Account created successfully.");

      // A full page load guarantees the freshly created session cookie
      // is sent with the dashboard request.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/dashboard");
    } catch (error: unknown) {
      console.error(
        "Registration error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while signing up.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // Google / GitHub Registration
  // =====================================================

  const handleSocialAuth = async (
    provider:
      | "google"
      | "github"
  ) => {
    setLoading(true);

    try {
      const { error } =
        await signIn.social({
          provider,
          callbackURL:
            "/dashboard",
        });

      if (error) {
        toast.error(
          error.message ||
            `Failed to sign up with ${provider}.`
        );

        setLoading(false);
      }
    } catch (error) {
      console.error(
        "Social authentication error:",
        error
      );

      toast.error(
        `Failed to sign up with ${provider}.`
      );

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f5f7] p-3 transition-colors duration-200 dark:bg-slate-950 sm:p-6 lg:p-8">

      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl grid-cols-1 overflow-hidden rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-12">

        {/* =====================================================
            LEFT FORM COLUMN
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

          {/* Form Container */}

          <div className="mx-auto my-6 w-full max-w-md">

            {/* Heading */}

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-[32px]">
              Create Account
            </h1>

            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              Choose your role and create your rEntsy account.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-5 space-y-3.5"
            >

              {/* =================================================
                  ROLE SELECTION
              ================================================== */}

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Select Account Role
                </label>

                <div className="grid grid-cols-2 gap-2.5">

                  {/* Customer */}

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      handleRoleSelect(
                        "customer"
                      )
                    }
                    className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-semibold transition ${
                      formData.role ===
                      "customer"
                        ? "border-[#6e13f9] bg-[#6e13f9]/10 text-[#6e13f9] dark:bg-[#6e13f9]/20 dark:text-[#b488ff]"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    <UserCheck className="h-4 w-4" />

                    <span>
                      Customer (Renter)
                    </span>
                  </button>

                  {/* Owner */}

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      handleRoleSelect(
                        "owner"
                      )
                    }
                    className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-semibold transition ${
                      formData.role ===
                      "owner"
                        ? "border-[#6e13f9] bg-[#6e13f9]/10 text-[#6e13f9] dark:bg-[#6e13f9]/20 dark:text-[#b488ff]"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    <Truck className="h-4 w-4" />

                    <span>
                      Equipment Owner
                    </span>
                  </button>

                </div>
              </div>

              {/* =================================================
                  FULL NAME
              ================================================== */}

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  required
                  value={
                    formData.name
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Rumi Parvez"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#6e13f9] focus:ring-2 focus:ring-[#6e13f9]/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-[#8b45ff]"
                />
              </div>

              {/* =================================================
                  EMAIL
              ================================================== */}

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  required
                  value={
                    formData.email
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="rumi@example.com"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#6e13f9] focus:ring-2 focus:ring-[#6e13f9]/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-[#8b45ff]"
                />
              </div>

              {/* =================================================
                  PASSWORD
              ================================================== */}

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>

                <div className="relative">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    required
                    value={
                      formData.password
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Min 6 chars, upper & lowercase"
                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3.5 pr-10 text-sm text-slate-900 outline-none transition focus:border-[#6e13f9] focus:ring-2 focus:ring-[#6e13f9]/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-[#8b45ff]"
                  />

                  <button
                    type="button"
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

              {/* =================================================
                  PROFILE DETAILS NOTE
              ================================================== */}

              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[11px] leading-5 text-slate-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400">
                You can add your phone number, address and profile photo
                later from your dashboard profile.
              </div>

              {/* =================================================
                  SUBMIT
              ================================================== */}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-lg bg-[#6e13f9] py-2.5 text-sm font-semibold text-white transition hover:bg-[#5b0ed6] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Signing Up..."
                  : `Sign Up as ${formData.role}`}
              </button>

            </form>

            {/* =================================================
                DIVIDER
            ================================================== */}

            <div className="my-5 flex items-center gap-3">

              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />

              <span className="text-xs text-slate-400">
                Or Sign Up With
              </span>

              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />

            </div>

            {/* =================================================
                GOOGLE + GITHUB
            ================================================== */}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

              {/* Google */}

              <button
                type="button"
                disabled={loading}
                onClick={() =>
                  handleSocialAuth(
                    "google"
                  )
                }
                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/70"
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
                  handleSocialAuth(
                    "github"
                  )
                }
                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/70"
              >
                <FaGithub className="h-4 w-4 shrink-0 text-slate-900 dark:text-white" />

                <span>
                  GitHub
                </span>
              </button>

            </div>

            {/* Login Link */}

            <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
              Already have an account?{" "}

              <Link
                href="/sign-in"
                className="font-semibold text-[#6e13f9] hover:underline dark:text-[#9b5cff]"
              >
                Log In.
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

            {/* Overlay */}

            <div className="absolute inset-0 bg-gradient-to-t from-[#380794]/95 via-[#6e13f9]/70 to-[#6e13f9]/55" />

            {/* Main Content */}

            <div className="relative z-10 max-w-md">

              <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-xs">
                Heavy Machinery &amp; Fleet Rental
              </span>

              <h2 className="mt-3 text-2xl font-bold leading-snug tracking-tight sm:text-3xl lg:text-[34px]">
                Cranes, trucks, and field gear on track.
              </h2>

              <p className="mt-2.5 text-sm leading-relaxed text-purple-100">
                Sign up as a Customer to book verified
                equipment or as an Owner to list and
                rent out your fleet.
              </p>

            </div>

            {/* Bottom Info */}

            <div className="relative z-10 mt-8 rounded-xl border border-white/20 bg-black/25 p-4 backdrop-blur-md">

              <p className="text-xs font-semibold uppercase tracking-wider text-purple-200">
                rEntsy Fleet Network
              </p>

              <p className="mt-1 text-sm text-white">
                Construction cranes, excavators,
                transport trucks, and pro gear ready
                for daily or project rentals.
              </p>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}