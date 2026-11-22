"use client";

import { useState } from "react";
import Link from "next/link";

import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarCheck,
  CircleDollarSign,
  ClipboardList,
  Clock,
  Heart,
  Mail,
  MapPin,
  Package,
  Phone,
  Plus,
  ShieldAlert,
  Sparkles,
  Star,
  UsersRound,
  Wallet,
} from "lucide-react";
import toast from "react-hot-toast";

import { Avatar } from "@/components/dashboard/Avatar";
import { Button } from "@/components/dashboard/Button";
import {
  MonthlyBarChart,
  RoleDonut,
} from "@/components/dashboard/Charts";
import { EmptyState, LoadingCard, Skeleton } from "@/components/dashboard/EmptyState";
import { RecentBookingsTable } from "@/components/dashboard/RecentBookings";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { useApi } from "@/hooks/use-api";
import { apiPatch, apiPost, getErrorMessage } from "@/lib/api";
import { roleAccent } from "@/lib/dashboard-nav";
import {
  formatCurrency,
  formatDate,
  formatNumber,
  roleLabel,
} from "@/lib/format";
import type {
  AdminAnalytics,
  CustomerAnalytics,
  DashboardUser,
  Equipment,
  OwnerAnalytics,
} from "@/types/dashboard";
import { cn } from "@/lib/utils";

type AnalyticsResponse<T> = {
  success: boolean;
  analytics: T;
};

export default function DashboardOverview({
  user,
  today,
  denied,
}: {
  user: DashboardUser;
  today: string;
  denied: boolean;
}) {
  return (
    <div className="space-y-5">
      <OverviewBanner user={user} today={today} />

      {denied && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-amber-800 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="text-xs font-semibold">
              That page is not available for your role.
            </p>
            <p className="mt-0.5 text-[11px] opacity-80">
              You were redirected to your own dashboard. Role-based
              access is enforced on the server as well.
            </p>
          </div>
        </div>
      )}

      {user.role === "admin" && <AdminOverview user={user} />}
      {user.role === "owner" && <OwnerOverview user={user} />}
      {user.role === "customer" && <CustomerOverview user={user} />}
    </div>
  );
}

/* =========================================================
   BANNER
========================================================= */

function OverviewBanner({
  user,
  today,
}: {
  user: DashboardUser;
  today: string;
}) {
  const accent = roleAccent[user.role];
  const firstName = user.name.split(" ")[0];

  const copy =
    user.role === "admin"
      ? "Keep an eye on users, equipment approvals and every rental across the platform."
      : user.role === "owner"
        ? "Track your fleet, respond to rental requests and grow your earnings."
        : "Find the right equipment, keep track of rentals and manage your favorites.";

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl bg-gradient-to-br p-5 text-white shadow-lg sm:p-6 lg:p-7",
        accent.gradient
      )}
    >
      <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full border-[28px] border-white/10" />
      <div className="pointer-events-none absolute -bottom-24 right-24 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute right-10 top-8 hidden h-20 w-20 rotate-12 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm lg:block" />

      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white ring-1 ring-inset ring-white/20">
            
            {roleLabel(user.role)} workspace · {today}
          </span>

          <h1 className="mt-3 text-2xl font-bold leading-tight tracking-tight sm:text-[30px]">
            Welcome back, {firstName} 👋
          </h1>

          <p className="mt-1.5 max-w-xl text-xs leading-5 text-white/80 sm:text-[13px]">
            {copy}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {user.role === "admin" && (
            <>
              <BannerAction href="/dashboard/users" label="Manage users" />
              <BannerAction
                href="/dashboard/equipment?status=pending"
                label="Review equipment"
                secondary
              />
            </>
          )}

          {user.role === "owner" && (
            <>
              <BannerAction
                href="/dashboard/add-equipment"
                label="Add equipment"
              />
              <BannerAction
                href="/dashboard/equipment"
                label="My equipment"
                secondary
              />
            </>
          )}

          {user.role === "customer" && (
            <>
              <BannerAction
                href="/dashboard/rentals"
                label="My rentals"
              />
              <BannerAction
                href="/dashboard/favorites"
                label="Favorites"
                secondary
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function BannerAction({
  href,
  label,
  secondary = false,
}: {
  href: string;
  label: string;
  secondary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-lg px-3.5 text-[11px] font-semibold transition",
        secondary
          ? "border border-white/25 bg-white/10 text-white hover:bg-white/20"
          : "bg-white text-[#2b0b63] hover:bg-purple-50"
      )}
    >
      {label}
      <ArrowUpRight className="h-3.5 w-3.5" />
    </Link>
  );
}

/* =========================================================
   ADMIN OVERVIEW
========================================================= */

function AdminOverview({ user }: { user: DashboardUser }) {
  const { data, loading, error, refresh } =
    useApi<AnalyticsResponse<AdminAnalytics>>("/analytics/admin");

  const analytics = data?.analytics;

  const [busyId, setBusyId] = useState<string | null>(null);

  const approve = async (equipment: Equipment) => {
    setBusyId(equipment._id);

    try {
      await apiPatch(`/equipment/${equipment._id}/status`, {
        status: "approved",
      });
      toast.success(`${equipment.equipmentName} approved.`);
      refresh();
    } catch (requestError) {
      toast.error(getErrorMessage(requestError));
    } finally {
      setBusyId(null);
    }
  };

  if (loading && !analytics) {
    return <OverviewSkeleton cards={6} />;
  }

  if (error || !analytics) {
    return <OverviewError message={error} onRetry={refresh} />;
  }

  const chartEmpty = analytics.monthlyBookings.every(
    (point) => point.value === 0
  );

  return (
    <div className="space-y-5">
      <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Total users"
          value={formatNumber(analytics.totalUsers)}
          icon={UsersRound}
          tone="violet"
          hint={`${analytics.customers} customers · ${analytics.owners} owners`}
        />
        <StatCard
          label="Total equipment"
          value={formatNumber(analytics.totalEquipment)}
          icon={Package}
          tone="sky"
          hint="Listed across every owner"
        />
        <StatCard
          label="Total bookings"
          value={formatNumber(analytics.totalBookings)}
          icon={ClipboardList}
          tone="amber"
          hint={`${analytics.completedRentals} completed rentals`}
        />
        <StatCard
          label="Pending approvals"
          value={formatNumber(analytics.pendingApprovals)}
          icon={Clock}
          tone="rose"
          hint="Equipment waiting for review"
        />
        <StatCard
          label="Completed rentals"
          value={formatNumber(analytics.completedRentals)}
          icon={BadgeCheck}
          tone="emerald"
          hint="Successfully finished bookings"
        />
        <StatCard
          label="Total revenue"
          value={formatCurrency(analytics.totalRevenue)}
          icon={CircleDollarSign}
          tone="violet"
          hint={`${analytics.admins} admin account(s)`}
        />
      </div>

      <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)]">
        <div className="min-w-0 space-y-5">
          <SectionCard
            title="Monthly bookings"
            subtitle="Booking volume over the last 6 months"
            action={
              <Link
                href="/dashboard/rentals"
                className="text-[11px] font-semibold text-primary hover:underline"
              >
                View rentals
              </Link>
            }
          >
            {chartEmpty ? (
              <EmptyState
                icon={ClipboardList}
                title="No booking activity yet"
                description="Monthly booking stats will appear once customers start renting equipment."
                compact
              />
            ) : (
              <MonthlyBarChart data={analytics.monthlyBookings} />
            )}
          </SectionCard>

          <SectionCard
            title="Recent rentals"
            subtitle="Latest booking activity across the platform"
            action={
              <Link
                href="/dashboard/rentals"
                className="text-[11px] font-semibold text-primary hover:underline"
              >
                All rentals
              </Link>
            }
          >
            <RecentBookingsTable
              bookings={analytics.recentBookings}
              role="admin"
            />
          </SectionCard>
        </div>

        <div className="min-w-0 space-y-5">
          <SectionCard
            title="User distribution"
            subtitle="Accounts by access level"
          >
            <RoleDonut
              customers={analytics.customers}
              owners={analytics.owners}
              admins={analytics.admins}
            />

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link
                href="/dashboard/users"
                className="flex items-center justify-between rounded-xl border border-border px-3 py-2.5 text-[11px] font-semibold text-foreground transition hover:border-primary/30 hover:bg-muted/40"
              >
                Manage users
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              </Link>
              <Link
                href="/dashboard/equipment"
                className="flex items-center justify-between rounded-xl border border-border px-3 py-2.5 text-[11px] font-semibold text-foreground transition hover:border-primary/30 hover:bg-muted/40"
              >
                Equipment
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              </Link>
            </div>
          </SectionCard>

          <SectionCard
            title="Pending approvals"
            subtitle="Newest equipment submissions"
            action={
              <Link
                href="/dashboard/equipment?status=pending"
                className="text-[11px] font-semibold text-primary hover:underline"
              >
                Review all
              </Link>
            }
          >
            {analytics.pendingEquipment.length === 0 ? (
              <EmptyState
                icon={BadgeCheck}
                title="Nothing to approve"
                description="New equipment submissions will show up here."
                compact
              />
            ) : (
              <div className="space-y-2.5">
                {analytics.pendingEquipment.map((equipment) => (
                  <div
                    key={equipment._id}
                    className="rounded-xl border border-border/70 bg-background/50 p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-foreground">
                          {equipment.equipmentName}
                        </p>
                        <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                          {equipment.ownerName} · {equipment.category}
                        </p>
                      </div>
                      <StatusBadge status={equipment.status} />
                    </div>

                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-foreground">
                        {formatCurrency(equipment.rentalPrice)}
                        <span className="font-normal text-muted-foreground">
                          /{equipment.rentalType}
                        </span>
                      </span>

                      <div className="flex gap-1.5">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            toast(
                              "Open the equipment page to review full details."
                            )
                          }
                        >
                          Details
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => approve(equipment)}
                          disabled={busyId === equipment._id}
                        >
                          {busyId === equipment._id
                            ? "Approving..."
                            : "Approve"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <ProfileCard user={user} />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   OWNER OVERVIEW
========================================================= */

function OwnerOverview({ user }: { user: DashboardUser }) {
  const { data, loading, error, refresh } =
    useApi<AnalyticsResponse<OwnerAnalytics>>("/analytics/owner");

  const analytics = data?.analytics;

  if (loading && !analytics) {
    return <OverviewSkeleton cards={4} />;
  }

  if (error || !analytics) {
    return <OverviewError message={error} onRetry={refresh} />;
  }

  const chartEmpty = analytics.monthlyEarnings.every(
    (point) => point.value === 0
  );

  return (
    <div className="space-y-5">
      <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Listed equipment"
          value={formatNumber(analytics.totalEquipment)}
          icon={Package}
          tone="emerald"
          hint={`${analytics.pendingApprovals} waiting for approval`}
        />
        <StatCard
          label="Active rentals"
          value={formatNumber(analytics.activeRentals)}
          icon={CalendarCheck}
          tone="sky"
          hint="Pending, confirmed or ongoing"
        />
        <StatCard
          label="Completed rentals"
          value={formatNumber(analytics.completedRentals)}
          icon={BadgeCheck}
          tone="violet"
          hint="Finished bookings"
        />
        <StatCard
          label="Total earnings"
          value={formatCurrency(analytics.totalEarnings)}
          icon={Wallet}
          tone="amber"
          hint="From paid bookings"
        />
      </div>

      <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)]">
        <div className="min-w-0 space-y-5">
          <SectionCard
            title="Monthly earnings"
            subtitle="Paid rental revenue over the last 6 months"
            action={
              <Link
                href="/dashboard/rentals"
                className="text-[11px] font-semibold text-primary hover:underline"
              >
                View rentals
              </Link>
            }
          >
            {chartEmpty ? (
              <EmptyState
                icon={Wallet}
                title="No earnings recorded yet"
                description="Paid bookings will be reflected in this chart automatically."
                compact
              />
            ) : (
              <MonthlyBarChart
                data={analytics.monthlyEarnings}
                color="#0d9488"
                currency
              />
            )}
          </SectionCard>

          <SectionCard
            title="Rental requests"
            subtitle="Latest bookings for your fleet"
            action={
              <Link
                href="/dashboard/rentals"
                className="text-[11px] font-semibold text-primary hover:underline"
              >
                Manage rentals
              </Link>
            }
          >
            <RecentBookingsTable
              bookings={analytics.recentBookings}
              role="owner"
            />
          </SectionCard>
        </div>

        <div className="min-w-0 space-y-5">
          <SectionCard title="Quick actions">
            <div className="space-y-2">
              <QuickLink
                href="/dashboard/add-equipment"
                icon={Plus}
                title="Add new equipment"
                description="List a new machine for rent"
              />
              <QuickLink
                href="/dashboard/equipment"
                icon={Package}
                title="Manage my equipment"
                description="Edit pricing and availability"
              />
              <QuickLink
                href="/dashboard/rentals"
                icon={ClipboardList}
                title="Rental requests"
                description="Confirm or complete bookings"
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Top equipment"
            subtitle="Best performing listings"
          >
            {analytics.topEquipment.length === 0 ? (
              <EmptyState
                icon={Star}
                title="No performance data"
                description="Rental revenue per equipment will appear here."
                compact
              />
            ) : (
              <div className="space-y-3">
                {analytics.topEquipment.map((item, index) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-3"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-[11px] font-bold text-muted-foreground">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-foreground">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {item.bookings} booking(s)
                      </p>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-foreground">
                      {formatCurrency(item.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <ProfileCard user={user} />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   CUSTOMER OVERVIEW
========================================================= */

function CustomerOverview({ user }: { user: DashboardUser }) {
  const { data, loading, error, refresh } =
    useApi<AnalyticsResponse<CustomerAnalytics>>(
      "/analytics/customer"
    );

  const analytics = data?.analytics;

  if (loading && !analytics) {
    return <OverviewSkeleton cards={4} />;
  }

  if (error || !analytics) {
    return <OverviewError message={error} onRetry={refresh} />;
  }

  const chartEmpty = analytics.monthlyBookings.every(
    (point) => point.value === 0
  );

  return (
    <div className="space-y-5">
      <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total rentals"
          value={formatNumber(analytics.totalRentals)}
          icon={ClipboardList}
          tone="sky"
          hint="All rental requests"
        />
        <StatCard
          label="Active rentals"
          value={formatNumber(analytics.activeRentals)}
          icon={CalendarCheck}
          tone="violet"
          hint="Confirmed or ongoing"
        />
        <StatCard
          label="Completed"
          value={formatNumber(analytics.completedRentals)}
          icon={BadgeCheck}
          tone="emerald"
          hint="Successfully returned"
        />
        <StatCard
          label="Saved favorites"
          value={formatNumber(analytics.favorites)}
          icon={Heart}
          tone="rose"
          hint={`${formatCurrency(analytics.totalSpent)} lifetime spend`}
        />
      </div>

      <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)]">
        <div className="min-w-0 space-y-5">
          <SectionCard
            title="Rental activity"
            subtitle="Your bookings over the last 6 months"
          >
            {chartEmpty ? (
              <EmptyState
                icon={CalendarCheck}
                title="No rental activity yet"
                description="Once you book equipment, your activity will be charted here."
                compact
              />
            ) : (
              <MonthlyBarChart
                data={analytics.monthlyBookings}
                color="#2563eb"
              />
            )}
          </SectionCard>

          <SectionCard
            title="Recent rentals"
            subtitle="Your latest booking requests"
            action={
              <Link
                href="/dashboard/rentals"
                className="text-[11px] font-semibold text-primary hover:underline"
              >
                View all
              </Link>
            }
          >
            <RecentBookingsTable
              bookings={analytics.recentBookings}
              role="customer"
            />
          </SectionCard>

          <SectionCard
            title="Recommended equipment"
            subtitle="Fresh listings from verified owners"
          >
            {analytics.recommendedEquipment.length === 0 ? (
              <EmptyState
                icon={Package}
                title="No equipment listed yet"
                description="New approved equipment will be recommended here."
                compact
              />
            ) : (
              <div className="grid gap-3 sm:grid-cols-3">
                {analytics.recommendedEquipment.map((equipment) => (
                  <EquipmentMiniCard
                    key={equipment._id}
                    equipment={equipment}
                  />
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        <div className="min-w-0 space-y-5">
          <ProfileCard user={user} />

          <SectionCard title="Quick actions">
            <div className="space-y-2">
              <QuickLink
                href="/dashboard/rentals"
                icon={ClipboardList}
                title="My rentals"
                description="Track and manage bookings"
              />
              <QuickLink
                href="/dashboard/favorites"
                icon={Heart}
                title="Favorites"
                description="Equipment you saved for later"
              />
              <QuickLink
                href="/dashboard/profile"
                icon={BadgeCheck}
                title="Complete your profile"
                description="Keep contact details up to date"
              />
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SHARED PIECES
========================================================= */

function ProfileCard({ user }: { user: DashboardUser }) {
  const fields = [
    user.name,
    user.email,
    user.image,
    user.phone,
    user.address,
  ].filter(Boolean).length;

  const completion = Math.round((fields / 5) * 100);

  return (
    <SectionCard
      title="Your profile"
      action={
        <Link
          href="/dashboard/profile"
          className="text-[11px] font-semibold text-primary hover:underline"
        >
          Edit
        </Link>
      }
    >
      <div className="flex items-center gap-3">
        <Avatar
          name={user.name}
          src={user.image}
          size="lg"
          className="ring-0"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {user.name}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            {user.email}
          </p>
          <div className="mt-1.5">
            <StatusBadge status={user.role} />
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2 border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-2">
          <Phone className="h-3.5 w-3.5" />
          <span className="truncate">
            {user.phone || "Add your phone number"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5" />
          <span className="truncate">
            {user.address || "Add your address"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-3.5 w-3.5" />
          <span className="truncate">
            Member since {formatDate(user.createdAt)}
          </span>
        </div>
      </div>

      <div className="mt-4">
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
    </SectionCard>
  );
}

function QuickLink({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: typeof Plus;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-border/70 bg-background/40 p-3 transition hover:border-primary/30 hover:bg-muted/40"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-semibold text-foreground">
          {title}
        </span>
        <span className="block truncate text-[10px] text-muted-foreground">
          {description}
        </span>
      </span>

      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  );
}

function EquipmentMiniCard({
  equipment,
}: {
  equipment: Equipment;
}) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);

    try {
      await apiPost("/favorites", {
        equipmentId: equipment._id,
      });
      setSaved(true);
      toast.success("Saved to favorites.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-background/40">
      <div className="flex h-24 items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
        {equipment.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={equipment.imageUrl}
            alt={equipment.equipmentName}
            className="h-full w-full object-cover"
          />
        ) : (
          <Package className="h-7 w-7 text-primary/50" />
        )}
      </div>

      <div className="p-3">
        <p className="truncate text-xs font-semibold text-foreground">
          {equipment.equipmentName}
        </p>
        <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
          {equipment.category}
        </p>

        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-foreground">
            {formatCurrency(equipment.rentalPrice)}
            <span className="text-[9px] font-normal text-muted-foreground">
              /{equipment.rentalType}
            </span>
          </span>

          <Button
            size="sm"
            variant={saved ? "soft" : "secondary"}
            onClick={save}
            disabled={saving || saved}
            className="h-7 px-2"
          >
            <Heart
              className={`h-3 w-3 ${saved ? "fill-current" : ""}`}
            />
            {saved ? "Saved" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function OverviewSkeleton({ cards }: { cards: number }) {
  return (
    <div className="space-y-5">
      <Skeleton className="h-[168px] w-full rounded-3xl" />

      <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: cards }).map((_, index) => (
          <LoadingCard key={index} />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)]">
        <Skeleton className="h-[340px] w-full rounded-2xl" />
        <Skeleton className="h-[340px] w-full rounded-2xl" />
      </div>
    </div>
  );
}

function OverviewError({
  message,
  onRetry,
}: {
  message?: string | null;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center dark:border-rose-400/20 dark:bg-rose-500/10">
      <p className="text-sm font-semibold text-rose-700 dark:text-rose-300">
        Could not load your dashboard data
      </p>
      <p className="mx-auto mt-1 max-w-md text-xs text-rose-600/80 dark:text-rose-300/70">
        {message ||
          "The API server may be offline. Make sure the Express server and MongoDB are running."}
      </p>
      <Button
        variant="secondary"
        size="sm"
        onClick={onRetry}
        className="mt-4 border-rose-200 text-rose-700 dark:border-rose-400/30 dark:text-rose-300"
      >
        Try again
      </Button>
    </div>
  );
}

// Re-exported for pages that need the same empty affordance.
export { OverviewError };
