"use client";

import React, { useState } from "react";
import Image from "@/components/ImageWithFallback";
import Link from "next/link";
import toast from "react-hot-toast";
import { API_URL } from "@/lib/api";

import {
  Check,
  Copy,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";

import logoImg from "../../app/assets/rEntsy-Photoroom.png";

const SUPPORT_EMAIL = "help@rentsy.com";
const SUPPORT_PHONE = "01407794143";
const INTERNATIONAL_ADDRESS =
  "7901 4th St N, Suite 300, St. Petersburg, FL 33702, USA";

const INQUIRY_CATEGORIES = [
  "Equipment Rental",
  "List Your Equipment",
  "Booking & Payments",
  "Account & Roles",
  "General Support",
] as const;

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "Equipment Rental",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_EMAIL);
      setCopiedEmail(true);
      toast.success("Copied help@rentsy.com to clipboard!");
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      toast.error("Could not copy email address.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          category: formData.category,
          message: formData.message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Failed to send message.");
        return;
      }

      toast.success(
        data.message || "Message received! We'll get back to you shortly."
      );
      setFormData({
        name: "",
        email: "",
        category: "Equipment Rental",
        message: "",
      });
    } catch {
      toast.error("Unable to reach server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 px-4 py-8 transition-colors duration-200 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Top Header */}
        <div className="mb-8">
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
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Contact rEntsy Support
          </h1>
          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
            Have questions about renting equipment, listing gear, or your
            account? Send a message directly to our team.
          </p>
        </div>

        {/* Main Split Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Contact Details Card */}
          <div className="flex flex-col justify-between rounded-2xl bg-[#6e13f9] p-6 text-white shadow-lg sm:p-8 lg:col-span-5">
            <div>
              <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide text-white">
                Direct Support Channels
              </span>
              <h2 className="mt-4 text-xl font-bold sm:text-2xl">
                Get in touch with us
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-purple-100">
                Our support desk assists renters and equipment owners with
                bookings, verification, and fleet operations.
              </p>

              <div className="mt-8 space-y-6">
                {/* Support Email */}
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-purple-200">
                      Support Email
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <a
                        href={`mailto:${SUPPORT_EMAIL}`}
                        className="text-sm font-semibold text-white hover:underline"
                      >
                        {SUPPORT_EMAIL}
                      </a>
                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        aria-label="Copy support email"
                        className="inline-flex items-center gap-1 rounded-md bg-white/15 px-2 py-0.5 text-[11px] font-medium text-white transition hover:bg-white/25"
                      >
                        {copiedEmail ? (
                          <>
                            <Check className="h-3 w-3" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-purple-200">
                      Phone / Hotline
                    </p>
                    <a
                      href={`tel:${SUPPORT_PHONE}`}
                      className="mt-1 inline-block text-sm font-semibold text-white hover:underline"
                    >
                      {SUPPORT_PHONE}
                    </a>
                  </div>
                </div>

                {/* International Address */}
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-purple-200">
                      International Office
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-white">
                      {INTERNATIONAL_ADDRESS}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 rounded-xl border border-white/15 bg-black/15 p-4 text-xs text-purple-100">
              All inquiries are logged securely and routed to{" "}
              <span className="font-semibold text-white">{SUPPORT_EMAIL}</span>.
            </div>
          </div>

          {/* Right Column: Contact Form Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-8 lg:col-span-7">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Send Us a Message
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Fill out the form below and our support team at{" "}
              <span className="font-medium text-[#6e13f9] dark:text-[#a66cff]">
                {SUPPORT_EMAIL}
              </span>{" "}
              will respond promptly.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Rumi Parvez"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#6e13f9] focus:ring-2 focus:ring-[#6e13f9]/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-[#8b45ff]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Your Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#6e13f9] focus:ring-2 focus:ring-[#6e13f9]/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-[#8b45ff]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Topic
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#6e13f9] focus:ring-2 focus:ring-[#6e13f9]/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-[#8b45ff]"
                >
                  {INQUIRY_CATEGORIES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message or rental inquiry here..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#6e13f9] focus:ring-2 focus:ring-[#6e13f9]/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-[#8b45ff]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#6e13f9] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5b0ed6] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                <span>{loading ? "Sending Message..." : "Send Message"}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}