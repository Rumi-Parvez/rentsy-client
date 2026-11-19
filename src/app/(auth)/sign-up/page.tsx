"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Truck, UserCheck } from "lucide-react";
import toast from "react-hot-toast";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import logoImg from "../../assets/rEntsy-Photoroom.png";
import { signIn, signUp } from "@/lib/auth-client";

type SignUpRole = "customer" | "owner";

const CRANE_IMAGE_URL =
  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "+8801",
    address: "Narsingdi, Bangladesh",
    photoURL: "https://example.com/profile.jpg",
    role: "customer" as SignUpRole,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (selectedRole: SignUpRole) => {
    // Only allow 'customer' or 'owner' on public registration
    const safeRole: SignUpRole = selectedRole === "owner" ? "owner" : "customer";
    setFormData((prev) => ({ ...prev, role: safeRole }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      toast.error("Name, email, and password are required.");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    // Enforce safe role on client before sending
    const safeRole: SignUpRole =
      formData.role === "owner" ? "owner" : "customer";

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      photoURL: formData.photoURL.trim() || "https://example.com/profile.jpg",
      phone: formData.phone.trim() || "+8801XXXXXXXXX",
      address: formData.address.trim() || "Narsingdi, Bangladesh",
      role: safeRole,
    };

    setLoading(true);
    try {
      const { error } = await signUp.email(payload);

      if (error) {
        toast.error(error.message || "Failed to create account.");
        return;
      }

      toast.success(`Account created as ${safeRole} and saved to MongoDB!`);
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Something went wrong while signing up.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: "google" | "github") => {
    setLoading(true);
    try {
      // Store chosen role (customer/owner) temporarily if needed on callback
      if (typeof window !== "undefined") {
        window.localStorage.setItem("rentsy_pending_role", formData.role);
      }
      await signIn.social({
        provider,
        callbackURL: "/dashboard",
      });
    } catch {
      toast.error(`Failed to sign up with ${provider}.`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f5f7] p-3 transition-colors duration-200 dark:bg-slate-950 sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl grid-cols-1 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-12">
        {/* Left Form Column */}
        <div className="flex flex-col justify-between p-6 sm:p-10 lg:col-span-6 xl:px-14 xl:py-10">
          {/* Top Logo */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
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

          {/* Center Sign Up Form */}
          <div className="mx-auto my-6 w-full max-w-md">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-[32px]">
              Create Account
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              Choose your role and create your rEntsy account.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
              {/* Role Selection: Customer or Owner ONLY */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Select Account Role
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleRoleSelect("customer")}
                    className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-semibold transition ${
                      formData.role === "customer"
                        ? "border-[#6e13f9] bg-[#6e13f9]/10 text-[#6e13f9] dark:bg-[#6e13f9]/20 dark:text-[#b488ff]"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    <UserCheck className="h-4 w-4" />
                    <span>Customer (Renter)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleSelect("owner")}
                    className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-semibold transition ${
                      formData.role === "owner"
                        ? "border-[#6e13f9] bg-[#6e13f9]/10 text-[#6e13f9] dark:bg-[#6e13f9]/20 dark:text-[#b488ff]"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    <Truck className="h-4 w-4" />
                    <span>Equipment Owner</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Rumi Parvez"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#6e13f9] focus:ring-2 focus:ring-[#6e13f9]/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-[#8b45ff]"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="rumi@example.com"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#6e13f9] focus:ring-2 focus:ring-[#6e13f9]/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-[#8b45ff]"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 8 characters"
                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3.5 pr-10 text-sm text-slate-900 outline-none transition focus:border-[#6e13f9] focus:ring-2 focus:ring-[#6e13f9]/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-[#8b45ff]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
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

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+8801XXXXXXXXX"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#6e13f9] focus:ring-2 focus:ring-[#6e13f9]/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-[#8b45ff]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Narsingdi, Bangladesh"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#6e13f9] focus:ring-2 focus:ring-[#6e13f9]/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-[#8b45ff]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Photo URL
                </label>
                <input
                  type="url"
                  name="photoURL"
                  value={formData.photoURL}
                  onChange={handleChange}
                  placeholder="https://example.com/profile.jpg"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#6e13f9] focus:ring-2 focus:ring-[#6e13f9]/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-[#8b45ff]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-lg bg-[#6e13f9] py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5b0ed6] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing Up..." : `Sign Up as ${formData.role}`}
              </button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              <span className="text-xs text-slate-400">Or Sign Up With</span>
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>

            {/* Google & GitHub Auth Buttons */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSocialAuth("google")}
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/70"
              >
                <FcGoogle className="h-4 w-4 shrink-0" />
                <span>Google</span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleSocialAuth("github")}
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/70"
              >
                <FaGithub className="h-4 w-4 shrink-0 text-slate-900 dark:text-white" />
                <span>GitHub</span>
              </button>
            </div>

            <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#6e13f9] hover:underline dark:text-[#9b5cff]"
              >
                Log In.
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-slate-400">
            <span>Copyright © 2026 rEntsy Equipment Rental.</span>
            <Link href="/privacy-policy" className="hover:text-[#6e13f9]">
              Privacy Policy
            </Link>
          </div>
        </div>

        {/* Right Showcase Panel with Crane / Equipment Photography */}
        <div className="p-3 lg:col-span-6 lg:p-4">
          <div className="relative flex h-full min-h-[360px] w-full flex-col justify-between overflow-hidden rounded-2xl bg-[#6e13f9] p-6 text-white sm:p-8 lg:p-10">
            {/* Background Equipment Image + Brand Purple Overlay */}
            <img
              src={CRANE_IMAGE_URL}
              alt="Crane and heavy construction equipment"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#380794]/95 via-[#6e13f9]/70 to-[#6e13f9]/55" />

            <div className="relative z-10 max-w-md">
              <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-xs">
                Heavy Machinery &amp; Fleet Rental
              </span>
              <h2 className="mt-3 text-2xl font-bold leading-snug tracking-tight sm:text-3xl lg:text-[34px]">
                Cranes, trucks, and field gear on track.
              </h2>
              <p className="mt-2.5 text-sm leading-relaxed text-purple-100">
                Sign up as a Customer to book verified equipment or as an Owner
                to list and rent out your fleet.
              </p>
            </div>

            <div className="relative z-10 mt-8 rounded-xl border border-white/20 bg-black/25 p-4 backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-wider text-purple-200">
                rEntsy Fleet Network
              </p>
              <p className="mt-1 text-sm text-white">
                Construction cranes, excavators, transport trucks, and pro gear
                ready for daily or project rentals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}