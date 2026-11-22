"use client";

import { useMemo, useState } from "react";
import {
  Download,
  Eye,
  RefreshCw,
  ShieldCheck,
  Trash2,
  UserPlus,
  UsersRound,
} from "lucide-react";
import toast from "react-hot-toast";

import { Avatar } from "@/components/dashboard/Avatar";
import { Button } from "@/components/dashboard/Button";
import { EmptyState, Skeleton } from "@/components/dashboard/EmptyState";
import { FilterSelect, SearchInput } from "@/components/dashboard/Filters";
import { ConfirmDialog, Modal } from "@/components/dashboard/Modal";
import { PageHeader } from "@/components/dashboard/SectionCard";
import { RoleBadge } from "@/components/dashboard/StatusBadge";
import { useApi } from "@/hooks/use-api";
import { apiDelete, apiPatch, getErrorMessage } from "@/lib/api";
import {
  formatDate,
  formatDateTime,
  initials,
  roleLabel,
} from "@/lib/format";
import type {
  DashboardUser,
  UserRole,
} from "@/types/dashboard";

type UsersResponse = {
  success: boolean;
  count: number;
  users: DashboardUser[];
};

const ROLE_FILTERS = [
  { label: "All roles", value: "" },
  { label: "Customers", value: "customer" },
  { label: "Owners", value: "owner" },
  { label: "Admins", value: "admin" },
];

const ROLE_OPTIONS: UserRole[] = ["customer", "owner", "admin"];

export default function UsersClient({
  currentUser,
  initialQuery = "",
}: {
  currentUser: DashboardUser;
  initialQuery?: string;
}) {
  const { data, loading, error, refresh } =
    useApi<UsersResponse>("/users");

  const [search, setSearch] = useState(initialQuery);
  const [role, setRole] = useState("");
  const [selected, setSelected] = useState<DashboardUser | null>(null);
  const [deleting, setDeleting] = useState<DashboardUser | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const users = data?.users || [];

  const counts = useMemo(
    () => ({
      total: users.length,
      customers: users.filter((user) => user.role === "customer")
        .length,
      owners: users.filter((user) => user.role === "owner").length,
      admins: users.filter((user) => user.role === "admin").length,
    }),
    [users]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return users.filter((user) => {
      if (role && user.role !== role) {
        return false;
      }

      if (!term) {
        return true;
      }

      return [user.name, user.email, user.phone]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(term)
        );
    });
  }, [role, search, users]);

  const changeRole = async (user: DashboardUser, nextRole: string) => {
    if (nextRole === user.role) return;

    setBusyId(user._id);

    try {
      await apiPatch(`/users/role/${user._id}`, {
        role: nextRole,
      });

      toast.success(
        `${user.name} is now ${roleLabel(nextRole)}.`
      );
      refresh();
    } catch (requestError) {
      toast.error(getErrorMessage(requestError));
    } finally {
      setBusyId(null);
    }
  };

  const deleteUser = async () => {
    if (!deleting) return;

    setBusyId(deleting._id);

    try {
      await apiDelete(`/users/${deleting._id}`);
      toast.success("User deleted.");
      setDeleting(null);
      refresh();
    } catch (requestError) {
      toast.error(getErrorMessage(requestError));
    } finally {
      setBusyId(null);
    }
  };

  const exportCsv = () => {
    if (filtered.length === 0) {
      toast.error("There are no users to export.");
      return;
    }

    const rows = [
      ["Name", "Email", "Phone", "Role", "Joined"],
      ...filtered.map((user) => [
        user.name,
        user.email,
        user.phone || "",
        user.role,
        formatDate(user.createdAt),
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map(
            (cell) =>
              `"${String(cell).replaceAll('"', '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `rentsy-users-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success("User list exported.");
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="All users"
        subtitle="Manage roles, review profiles and keep the marketplace trusted."
        actions={
          <>
            <Button
              variant="secondary"
              size="md"
              onClick={exportCsv}
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={refresh}
              disabled={loading}
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </>
        }
      />

      <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryChip
          label="Total users"
          value={counts.total}
          tone="violet"
        />
        <SummaryChip
          label="Customers"
          value={counts.customers}
          tone="sky"
        />
        <SummaryChip
          label="Owners"
          value={counts.owners}
          tone="emerald"
        />
        <SummaryChip
          label="Admins"
          value={counts.admins}
          tone="violet"
        />
      </div>

      <div className="rounded-2xl border border-border/70 bg-card shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col gap-3 border-b border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search name, email or phone..."
            className="w-full sm:max-w-sm"
          />

          <div className="flex flex-wrap items-center gap-2">
            <FilterSelect
              value={role}
              onChange={setRole}
              options={ROLE_FILTERS}
              ariaLabel="Filter by role"
            />
            <span className="rounded-lg bg-muted px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground">
              {filtered.length} result(s)
            </span>
          </div>
        </div>

        {loading ? (
          <div className="space-y-2 p-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <Skeleton key={item} className="h-14 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">
              Could not load users
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {error}
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={refresh}
              className="mt-3"
            >
              Try again
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={UsersRound}
              title={
                users.length === 0
                  ? "No users yet"
                  : "No users match your filters"
              }
              description={
                users.length === 0
                  ? "Registered accounts will appear here automatically."
                  : "Try a different search term or role filter."
              }
            />
          </div>
        ) : (
          <>
          <div className="space-y-2 p-3 xl:hidden">
            {filtered.map((user) => {
              const isSelf = user._id === currentUser._id;

              return (
                <article
                  key={user._id}
                  className="min-w-0 rounded-xl border border-border/70 bg-background/50 p-3"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Avatar
                      name={user.name}
                      src={user.image}
                      size="md"
                      className="h-9 w-9 shrink-0 ring-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="flex min-w-0 items-center gap-1.5 text-xs font-semibold text-foreground">
                        <span className="truncate">{user.name}</span>
                        {isSelf && (
                          <span className="shrink-0 rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">
                            You
                          </span>
                        )}
                      </p>
                      <p className="break-all text-[10px] text-muted-foreground">{user.email}</p>
                    </div>
                    <RoleBadge role={user.role} />
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-2.5 text-[10px]">
                    <div className="min-w-0">
                      <p className="text-muted-foreground">Phone</p>
                      <p className="break-words font-medium text-foreground">{user.phone || "—"}</p>
                    </div>
                    <div className="text-muted-foreground">
                      Joined {formatDate(user.createdAt)}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <select
                      value={user.role}
                      disabled={isSelf || busyId === user._id}
                      onChange={(event) => changeRole(user, event.target.value)}
                      aria-label={`Change role for ${user.name}`}
                      className="h-8 max-w-full rounded-lg border border-border bg-card px-2 text-[10px] font-medium outline-none focus:border-primary/50 disabled:opacity-50"
                    >
                      {ROLE_OPTIONS.map((roleOption) => (
                        <option key={roleOption} value={roleOption}>
                          {roleLabel(roleOption)}
                        </option>
                      ))}
                    </select>
                    <Button variant="secondary" size="sm" onClick={() => setSelected(user)}>
                      <Eye className="h-3 w-3" />
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-rose-500 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40 dark:hover:bg-rose-500/10"
                      disabled={isSelf}
                      onClick={() => setDeleting(user)}
                      aria-label="Delete user"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="hidden overflow-x-auto xl:block">
            <table className="w-full min-w-[820px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                  <th className="px-4 py-3 font-semibold">User</th>
                  <th className="px-4 py-3 font-semibold">Phone</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">
                    Registered
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/50">
                {filtered.map((user) => {
                  const isSelf = user._id === currentUser._id;

                  return (
                    <tr
                      key={user._id}
                      className="transition hover:bg-muted/30"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar
                            name={user.name}
                            src={user.image}
                            size="md"
                            className="h-9 w-9 ring-0"
                          />
                          <div className="min-w-0">
                            <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                              <span className="max-w-[150px] truncate">
                                {user.name}
                              </span>
                              {isSelf && (
                                <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">
                                  You
                                </span>
                              )}
                            </p>
                            <p className="max-w-[180px] truncate text-[10px] text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-muted-foreground">
                        {user.phone || "—"}
                      </td>

                      <td className="px-4 py-3">
                        <RoleBadge role={user.role} />
                      </td>

                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                        {formatDate(user.createdAt)}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center justify-end gap-1.5">
                          <select
                            value={user.role}
                            disabled={isSelf || busyId === user._id}
                            onChange={(event) =>
                              changeRole(user, event.target.value)
                            }
                            aria-label={`Change role for ${user.name}`}
                            className="h-8 rounded-lg border border-border bg-card px-2 text-[10px] font-medium outline-none focus:border-primary/50 disabled:opacity-50"
                          >
                            {ROLE_OPTIONS.map((roleOption) => (
                              <option
                                key={roleOption}
                                value={roleOption}
                              >
                                {roleLabel(roleOption)}
                              </option>
                            ))}
                          </select>

                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setSelected(user)}
                          >
                            <Eye className="h-3 w-3" />
                            View
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-rose-500 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40 dark:hover:bg-rose-500/10"
                            disabled={isSelf}
                            onClick={() => setDeleting(user)}
                            aria-label="Delete user"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          </>
        )}
      </div>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.name || "User profile"}
        description={selected?.email}
        size="md"
        footer={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSelected(null)}
          >
            Close
          </Button>
        }
      >
        {selected && <UserDetails user={selected} />}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete user"
        message={`This removes ${deleting?.name || "this user"}'s profile and sign-in access. Their existing rentals and equipment are not removed. This cannot be undone.`}
        confirmLabel="Delete user"
        loading={busyId === deleting?._id}
        onClose={() => setDeleting(null)}
        onConfirm={deleteUser}
      />
    </div>
  );
}

function UserDetails({ user }: { user: DashboardUser }) {
  const rows = [
    ["Full name", user.name],
    ["Email", user.email],
    ["Phone", user.phone || "—"],
    ["Address", user.address || "—"],
    ["Role", roleLabel(user.role)],
    ["Registered", formatDateTime(user.createdAt)],
    ["Last updated", formatDateTime(user.updatedAt)],
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-4">
        <Avatar
          name={user.name}
          src={user.image}
          size="xl"
          className="ring-0"
        />
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-foreground">
            {user.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {user.email}
          </p>
          <div className="mt-2">
            <RoleBadge role={user.role} />
          </div>
        </div>
      </div>

      <dl className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border/70">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="grid grid-cols-1 gap-1 px-3.5 py-2.5 text-xs sm:grid-cols-[130px_1fr] sm:gap-3"
          >
            <dt className="font-medium text-muted-foreground">
              {label}
            </dt>
            <dd className="break-words font-medium text-foreground">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      {user.role === "admin" ? (
        <div className="flex items-start gap-2 rounded-xl border border-violet-200 bg-violet-50 p-3 text-[11px] text-violet-700 dark:border-violet-400/20 dark:bg-violet-500/10 dark:text-violet-300">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
          This account can manage users, equipment approvals and
          every rental on the platform.
        </div>
      ) : (
        <div className="flex items-start gap-2 rounded-xl border border-border bg-muted/40 p-3 text-[11px] text-muted-foreground">
          <UserPlus className="mt-0.5 h-4 w-4 shrink-0" />
          Change this account&apos;s role from the table to grant
          owner or admin access.
        </div>
      )}

      <p className="text-[10px] text-muted-foreground">
        Avatar initials: {initials(user.name)}
      </p>
    </div>
  );
}

function SummaryChip({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "violet" | "sky" | "emerald";
}) {
  const tones = {
    violet:
      "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300",
    sky: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300",
    emerald:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
  };

  return (
    <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-card px-4 py-3.5">
      <span className="text-xs font-medium text-muted-foreground">
        {label}
      </span>
      <span
        className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-bold ${tones[tone]}`}
      >
        {value}
      </span>
    </div>
  );
}
