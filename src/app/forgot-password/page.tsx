"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, KeyRound, Mail, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

import { API_URL } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanEmail.split("@")[0] || "rEntsy user",
          email: cleanEmail,
          category: "Account & Roles",
          message: `Password reset request for account ${cleanEmail}. Please verify my identity and help me regain access.`,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.success === false) {
        toast.error(data.message || "Could not submit your request.");
        return;
      }

      setSent(true);
      toast.success("Reset request submitted.");
    } catch {
      toast.error("Unable to reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 px-4 py-12 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg">
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition hover:text-[#6e13f9] dark:text-slate-400 dark:hover:text-[#a66cff]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to sign in
        </Link>

        <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#6e13f9] via-[#a66cff] to-[#6e13f9]" />

          <div className="p-6 sm:p-9">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6e13f9]/10 text-[#6e13f9] dark:bg-[#6e13f9]/20 dark:text-[#c4a4ff]">
              <KeyRound className="h-5 w-5" />
            </span>

            <h1 className="mt-5 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Forgot your password?
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Enter the email linked to your rEntsy account. We will send a
              verified reset request to our support team, who will help you
              regain access securely.
            </p>

            {sent ? (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center dark:border-emerald-900/40 dark:bg-emerald-950/20">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                <h2 className="mt-3 text-base font-bold text-emerald-900 dark:text-emerald-200">
                  Request received
                </h2>
                <p className="mt-1.5 text-sm leading-6 text-emerald-800/80 dark:text-emerald-200/80">
                  If an account exists for{" "}
                  <span className="font-semibold">{email.trim()}</span>, our
                  support team will contact you within one business day.
                </p>
                <div className="mt-5 flex flex-col justify-center gap-2.5 sm:flex-row">
                  <Link
                    href="/sign-in"
                    className="inline-flex items-center justify-center rounded-xl bg-[#6e13f9] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#5b0ed6]"
                  >
                    Back to sign in
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Contact support
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label
                    htmlFor="reset-email"
                    className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Account email
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="reset-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3.5 text-sm text-slate-900 outline-none transition focus:border-[#6e13f9] focus:bg-white focus:ring-2 focus:ring-[#6e13f9]/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#6e13f9] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#5b0ed6] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Mail className="h-4 w-4" />
                  {loading ? "Submitting request..." : "Send reset request"}
                </button>
              </form>
            )}

            <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-slate-50 p-3.5 text-[11px] leading-5 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#6e13f9] dark:text-[#a66cff]" />
              For security, we never reveal whether an email is registered and
              never send passwords by email.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
