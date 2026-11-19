"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import toast from "react-hot-toast";

import { Avatar } from "@/components/dashboard/Avatar";
import { Button } from "@/components/dashboard/Button";
import { PageHeader, SectionCard } from "@/components/dashboard/SectionCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { authClient } from "@/lib/auth-client";
import { apiPatch, getErrorMessage } from "@/lib/api";
import { formatDate, roleLabel } from "@/lib/format";
import type { DashboardUser } from "@/types/dashboard";

const inputClass =
  "h-10 w-full rounded-lg border border-border bg-card px-3 text-xs text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary/50 focus:ring-2 focus:ring-primary/15";

const readOnlyClass =
  "h-10 w-full cursor-not-allowed rounded-lg border border-border bg-muted/40 px-3 text-xs text-muted-foreground outline-none";

const labelClass =
  "mb-1.5 block text-[11px] font-semibold text-foreground";

export default function ProfileClient({
  user,
}: {
  user: DashboardUser;
}) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: user.name,
    phone: user.phone || "",
    address: user.address || "",
    image: user.image || "",
  });

  const [saving, setSaving] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const update = (field: keyof typeof form, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error("Your name cannot be empty.");
      return;
    }

    setSaving(true);

    try {
      await apiPatch("/users/me", {
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        image: form.image.trim(),
      });

      // Keep the Better Auth identity in sync as well.
      await authClient.updateUser({
        name: form.name.trim(),
        image: form.image.trim(),
      });

      toast.success("Profile updated.");
      router.refresh();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const resetProfile = () => {
    setForm({
      name: user.name,
      phone: user.phone || "",
      address: user.address || "",
      image: user.image || "",
    });

    toast.success("Changes reset.");
  };

  const changePassword = async (event: React.FormEvent) => {
    event.preventDefault();

    if (passwordForm.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }

    if (
      passwordForm.newPassword !==
      passwordForm.confirmPassword
    ) {
      toast.error("New passwords do not match.");
      return;
    }

    setChangingPassword(true);

    try {
      const { error } = await authClient.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        toast.error(
          error.message || "Could not change your password."
        );
        return;
      }

      toast.success("Password changed successfully.");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setChangingPassword(false);
    }
  };

  const completion =
    [form.name, user.email, form.phone, form.address, form.image].filter(
      Boolean
    ).length * 20;

  return (
    <div className="space-y-5">
      <PageHeader
        title="My profile"
        subtitle="Manage your personal information, avatar and account security."
        actions={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-semibold text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            {roleLabel(user.role)} account
          </span>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,1fr)]">
        <div className="space-y-5">
          <SectionCard
            title="Personal information"
            subtitle="This information is visible on your rental activity."
          >
            <form onSubmit={saveProfile} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className={labelClass}>
                    Full name
                  </label>
                  <input
                    id="name"
                    className={inputClass}
                    value={form.name}
                    onChange={(event) =>
                      update("name", event.target.value)
                    }
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email address
                  </label>
                  <input
                    id="email"
                    className={readOnlyClass}
                    value={user.email}
                    readOnly
                  />
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    Email is managed by your sign-in provider.
                  </p>
                </div>

                <div>
                  <label htmlFor="phone" className={labelClass}>
                    Phone number
                  </label>
                  <input
                    id="phone"
                    className={inputClass}
                    value={form.phone}
                    onChange={(event) =>
                      update("phone", event.target.value)
                    }
                    placeholder="+8801XXXXXXXXX"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="address" className={labelClass}>
                    Address
                  </label>
                  <input
                    id="address"
                    className={inputClass}
                    value={form.address}
                    onChange={(event) =>
                      update("address", event.target.value)
                    }
                    placeholder="City, area, full address"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="image" className={labelClass}>
                    Profile image URL
                  </label>
                  <input
                    id="image"
                    type="url"
                    className={inputClass}
                    value={form.image}
                    onChange={(event) =>
                      update("image", event.target.value)
                    }
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
                <p className="text-[10px] text-muted-foreground">
                  Member since {formatDate(user.createdAt)}
                </p>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={resetProfile}
                    disabled={saving}
                  >
                    Reset
                  </Button>
                  <Button type="submit" size="md" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-3.5 w-3.5" />
                        Save changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </SectionCard>

          <SectionCard
            title="Password & security"
            subtitle="Change the password used for email sign-in."
          >
            <form onSubmit={changePassword} className="space-y-4">
              <div>
                <label
                  htmlFor="currentPassword"
                  className={labelClass}
                >
                  Current password
                </label>
                <input
                  id="currentPassword"
                  type={showPassword ? "text" : "password"}
                  className={inputClass}
                  value={passwordForm.currentPassword}
                  onChange={(event) =>
                    setPasswordForm((current) => ({
                      ...current,
                      currentPassword: event.target.value,
                    }))
                  }
                  placeholder="Enter current password"
                  autoComplete="current-password"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="newPassword"
                    className={labelClass}
                  >
                    New password
                  </label>
                  <input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    className={inputClass}
                    value={passwordForm.newPassword}
                    onChange={(event) =>
                      setPasswordForm((current) => ({
                        ...current,
                        newPassword: event.target.value,
                      }))
                    }
                    placeholder="Minimum 8 characters"
                    autoComplete="new-password"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className={labelClass}
                  >
                    Confirm new password
                  </label>
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    className={inputClass}
                    value={passwordForm.confirmPassword}
                    onChange={(event) =>
                      setPasswordForm((current) => ({
                        ...current,
                        confirmPassword: event.target.value,
                      }))
                    }
                    placeholder="Repeat new password"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground transition hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                  {showPassword ? "Hide passwords" : "Show passwords"}
                </button>

                <Button
                  type="submit"
                  size="md"
                  disabled={changingPassword}
                >
                  {changingPassword ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <KeyRound className="h-3.5 w-3.5" />
                      Update password
                    </>
                  )}
                </Button>
              </div>
            </form>

            <p className="mt-3 rounded-lg bg-muted/40 px-3 py-2 text-[10px] leading-4 text-muted-foreground">
              Google / GitHub accounts may not have a password. In
              that case sign-in continues through your provider.
            </p>
          </SectionCard>
        </div>

        <div className="space-y-5">
          <SectionCard title="Profile preview">
            <div className="flex flex-col items-center text-center">
              <Avatar
                name={form.name}
                src={form.image}
                size="xl"
                className="ring-4 ring-primary/10"
              />

              <h2 className="mt-3 max-w-full truncate text-base font-semibold text-foreground">
                {form.name || "Your name"}
              </h2>

              <p className="mt-0.5 max-w-full truncate text-[11px] text-muted-foreground">
                {user.email}
              </p>

              <div className="mt-2">
                <StatusBadge status={user.role} />
              </div>

              <div className="mt-4 w-full space-y-2 rounded-xl border border-border/70 bg-background/40 p-3 text-left text-[11px] text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">
                    {form.phone || "No phone added"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">
                    {form.address || "No address added"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserRound className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">
                    {roleLabel(user.role)}
                  </span>
                </div>
              </div>

              <div className="mt-4 w-full">
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>Profile completion</span>
                  <span className="font-semibold text-foreground">
                    {completion}%
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#6e13f9] to-[#a855f7]"
                    style={{ width: `${completion}%` }}
                  />
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Account details">
            <div className="space-y-3 text-[11px]">
              <Row label="Account ID" value={user._id} />
              <Row label="Role" value={roleLabel(user.role)} />
              <Row
                label="Joined"
                value={formatDate(user.createdAt)}
              />
              <Row
                label="Last updated"
                value={formatDate(user.updatedAt)}
              />
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-[10px] leading-4 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300">
              <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Role changes are protected. Only an administrator can
              change your access level.
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="max-w-[150px] truncate font-medium text-foreground">
        {value || "—"}
      </span>
    </div>
  );
}
