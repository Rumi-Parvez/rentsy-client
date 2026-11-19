"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  ClipboardList,
  Eye,
  RefreshCw,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import { Avatar } from "@/components/dashboard/Avatar";
import { Button } from "@/components/dashboard/Button";
import { EmptyState, Skeleton } from "@/components/dashboard/EmptyState";
import { FilterSelect, SearchInput } from "@/components/dashboard/Filters";
import { ConfirmDialog, Modal } from "@/components/dashboard/Modal";
import { PageHeader } from "@/components/dashboard/SectionCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { useApi } from "@/hooks/use-api";
import { apiDelete, apiPatch, getErrorMessage } from "@/lib/api";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
} from "@/lib/format";
import type {
  Booking,
  DashboardUser,
} from "@/types/dashboard";

type BookingsResponse = {
  success: boolean;
  count: number;
  bookings: Booking[];
};

const STATUS_OPTIONS = [
  { label: "All statuses", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Ongoing", value: "ongoing" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Rejected", value: "rejected" },
];

const BOOKING_STATUS_OPTIONS = STATUS_OPTIONS.slice(1);

const PAYMENT_OPTIONS = [
  { label: "Pending", value: "pending" },
  { label: "Paid", value: "paid" },
  { label: "Failed", value: "failed" },
  { label: "Refunded", value: "refunded" },
];

export default function RentalsClient({
  user,
  initialQuery = "",
}: {
  user: DashboardUser;
  initialQuery?: string;
}) {
  const endpoint =
    user.role === "admin"
      ? "/bookings"
      : user.role === "owner"
        ? "/bookings/owner"
        : "/bookings/my";

  const { data, loading, error, refresh } =
    useApi<BookingsResponse>(endpoint);

  const [search, setSearch] = useState(initialQuery);
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [pendingAction, setPendingAction] = useState<{
    booking: Booking;
    nextStatus: string;
    label: string;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<Booking | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const bookings = data?.bookings || [];

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      if (status && booking.bookingStatus !== status) {
        return false;
      }

      if (!term) {
        return true;
      }

      return [
        booking.bookingId,
        booking.equipmentName,
        booking.customerName,
        booking.customerEmail,
        booking.ownerName,
        booking.ownerEmail,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(term)
        );
    });
  }, [bookings, search, status]);

  const counts = useMemo(
    () => ({
      total: bookings.length,
      active: bookings.filter((booking) =>
        ["pending", "confirmed", "ongoing"].includes(
          booking.bookingStatus
        )
      ).length,
      completed: bookings.filter(
        (booking) => booking.bookingStatus === "completed"
      ).length,
      cancelled: bookings.filter((booking) =>
        ["cancelled", "rejected"].includes(
          booking.bookingStatus
        )
      ).length,
    }),
    [bookings]
  );

  const runStatusUpdate = async (
    booking: Booking,
    nextStatus: string,
    paymentStatus?: string
  ) => {
    setBusyId(booking._id);

    try {
      await apiPatch(`/bookings/${booking._id}/status`, {
        bookingStatus: nextStatus,
        ...(paymentStatus ? { paymentStatus } : {}),
      });

      toast.success(`${booking.bookingId} updated.`);
      setPendingAction(null);
      refresh();
    } catch (requestError) {
      toast.error(getErrorMessage(requestError));
    } finally {
      setBusyId(null);
    }
  };

  const updatePayment = async (
    booking: Booking,
    paymentStatus: string
  ) => {
    setBusyId(booking._id);

    try {
      await apiPatch(`/bookings/${booking._id}/status`, {
        paymentStatus,
      });

      toast.success("Payment status updated.");
      refresh();
    } catch (requestError) {
      toast.error(getErrorMessage(requestError));
    } finally {
      setBusyId(null);
    }
  };

  const deleteBooking = async () => {
    if (!deleteTarget) return;

    setBusyId(deleteTarget._id);

    try {
      await apiDelete(`/bookings/${deleteTarget._id}`);
      toast.success("Booking deleted.");
      setDeleteTarget(null);
      refresh();
    } catch (requestError) {
      toast.error(getErrorMessage(requestError));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title={
          user.role === "admin"
            ? "All rentals"
            : user.role === "owner"
              ? "My equipment rentals"
              : "My rentals"
        }
        subtitle={
          user.role === "admin"
            ? "Every booking across the marketplace, with payment and booking controls."
            : user.role === "owner"
              ? "Manage requests for your fleet and keep every rental on track."
              : "Track your booking requests, payment state and rental history."
        }
        actions={
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
        }
      />

      <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryChip
          label="Total rentals"
          value={counts.total}
          tone="violet"
        />
        <SummaryChip
          label="Active"
          value={counts.active}
          tone="sky"
        />
        <SummaryChip
          label="Completed"
          value={counts.completed}
          tone="emerald"
        />
        <SummaryChip
          label="Cancelled / rejected"
          value={counts.cancelled}
          tone="rose"
        />
      </div>

      <div className="rounded-2xl border border-border/70 bg-card shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col gap-3 border-b border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search booking, equipment, customer..."
            className="w-full sm:max-w-sm"
          />

          <div className="flex flex-wrap items-center gap-2">
            <FilterSelect
              value={status}
              onChange={setStatus}
              options={STATUS_OPTIONS}
              ariaLabel="Filter by booking status"
            />

            <span className="rounded-lg bg-muted px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground">
              {filtered.length} result(s)
            </span>
          </div>
        </div>

        {loading ? (
          <div className="p-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="mt-2 h-14 w-full" />
            <Skeleton className="mt-2 h-14 w-full" />
            <Skeleton className="mt-2 h-14 w-full" />
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">
              Could not load rentals
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
              icon={ClipboardList}
              title={
                bookings.length === 0
                  ? "No rentals yet"
                  : "No rentals match your filters"
              }
              description={
                bookings.length === 0
                  ? user.role === "customer"
                    ? "When you book equipment, your rental requests will be listed here."
                    : "New rental requests will appear here automatically."
                  : "Try changing the search term or status filter."
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                  <th className="px-4 py-3 font-semibold">
                    Equipment
                  </th>

                  {user.role !== "customer" && (
                    <th className="px-4 py-3 font-semibold">
                      Customer
                    </th>
                  )}

                  {user.role === "admin" && (
                    <th className="px-4 py-3 font-semibold">
                      Owner
                    </th>
                  )}

                  <th className="px-4 py-3 font-semibold">
                    Rental period
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    Amount
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    Payment
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/50">
                {filtered.map((booking) => (
                  <tr
                    key={booking._id}
                    className="transition hover:bg-muted/30"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <CalendarDays className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="max-w-[170px] truncate font-semibold text-foreground">
                            {booking.equipmentName}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {booking.bookingId}
                          </p>
                        </div>
                      </div>
                    </td>

                    {user.role !== "customer" && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar
                            name={booking.customerName}
                            size="sm"
                            className="h-7 w-7 ring-0"
                          />
                          <div className="min-w-0">
                            <p className="max-w-[120px] truncate font-medium text-foreground">
                              {booking.customerName}
                            </p>
                            <p className="max-w-[120px] truncate text-[10px] text-muted-foreground">
                              {booking.customerEmail}
                            </p>
                          </div>
                        </div>
                      </td>
                    )}

                    {user.role === "admin" && (
                      <td className="max-w-[140px] truncate px-4 py-3 text-muted-foreground">
                        {booking.ownerName}
                      </td>
                    )}

                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {formatDate(booking.rentalStartDate)}
                      <span className="mx-1 opacity-50">→</span>
                      {formatDate(booking.rentalEndDate)}
                      <p className="text-[10px] text-muted-foreground/80">
                        {booking.duration} day(s) · qty{" "}
                        {booking.requiredQuantity}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-foreground">
                      {formatCurrency(booking.totalAmount)}
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge
                        status={booking.paymentStatus}
                      />
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge
                        status={booking.bookingStatus}
                      />
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center justify-end gap-1.5">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelected(booking)}
                          title="View booking details"
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </Button>

                        {user.role === "customer" &&
                          ["pending", "confirmed"].includes(
                            booking.bookingStatus
                          ) && (
                            <Button
                              variant="danger"
                              size="sm"
                              disabled={busyId === booking._id}
                              onClick={() =>
                                setPendingAction({
                                  booking,
                                  nextStatus: "cancelled",
                                  label: "Cancel rental",
                                })
                              }
                            >
                              Cancel
                            </Button>
                          )}

                        {user.role === "owner" && (
                          <OwnerActions
                            booking={booking}
                            busy={busyId === booking._id}
                            onAction={(nextStatus, label) =>
                              setPendingAction({
                                booking,
                                nextStatus,
                                label,
                              })
                            }
                          />
                        )}

                        {user.role === "admin" && (
                          <>
                            <select
                              value={booking.bookingStatus}
                              disabled={busyId === booking._id}
                              onChange={(event) =>
                                runStatusUpdate(
                                  booking,
                                  event.target.value
                                )
                              }
                              aria-label="Booking status"
                              className="h-8 rounded-lg border border-border bg-card px-2 text-[10px] font-medium outline-none focus:border-primary/50"
                            >
                              {BOOKING_STATUS_OPTIONS.map((option) => (
                                <option
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </option>
                              ))}
                            </select>

                            <select
                              value={booking.paymentStatus}
                              disabled={busyId === booking._id}
                              onChange={(event) =>
                                updatePayment(
                                  booking,
                                  event.target.value
                                )
                              }
                              aria-label="Payment status"
                              className="h-8 rounded-lg border border-border bg-card px-2 text-[10px] font-medium outline-none focus:border-primary/50"
                            >
                              {PAYMENT_OPTIONS.map((option) => (
                                <option
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </option>
                              ))}
                            </select>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"
                              onClick={() =>
                                setDeleteTarget(booking)
                              }
                              aria-label="Delete booking"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details modal */}
      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.equipmentName || "Booking details"}
        description={selected?.bookingId}
        size="lg"
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
        {selected && <BookingDetails booking={selected} />}
      </Modal>

      {/* Status confirmation */}
      <ConfirmDialog
        open={Boolean(pendingAction)}
        title={pendingAction?.label || "Update booking"}
        message={
          pendingAction
            ? `Are you sure you want to mark ${pendingAction.booking.bookingId} as ${pendingAction.nextStatus}?`
            : ""
        }
        confirmLabel="Yes, continue"
        loading={busyId === pendingAction?.booking._id}
        onClose={() => setPendingAction(null)}
        onConfirm={() => {
          if (pendingAction) {
            runStatusUpdate(
              pendingAction.booking,
              pendingAction.nextStatus
            );
          }
        }}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete booking"
        message={`This permanently removes ${deleteTarget?.bookingId || "this booking"} from the platform. This cannot be undone.`}
        confirmLabel="Delete booking"
        loading={busyId === deleteTarget?._id}
        onClose={() => setDeleteTarget(null)}
        onConfirm={deleteBooking}
      />
    </div>
  );
}

function OwnerActions({
  booking,
  busy,
  onAction,
}: {
  booking: Booking;
  busy: boolean;
  onAction: (nextStatus: string, label: string) => void;
}) {
  if (booking.bookingStatus === "pending") {
    return (
      <>
        <Button
          size="sm"
          disabled={busy}
          onClick={() => onAction("confirmed", "Confirm booking")}
        >
          Confirm
        </Button>
        <Button
          size="sm"
          variant="secondary"
          disabled={busy}
          onClick={() => onAction("rejected", "Reject booking")}
        >
          Reject
        </Button>
      </>
    );
  }

  if (booking.bookingStatus === "confirmed") {
    return (
      <Button
        size="sm"
        disabled={busy}
        onClick={() => onAction("ongoing", "Start rental")}
      >
        Start
      </Button>
    );
  }

  if (booking.bookingStatus === "ongoing") {
    return (
      <Button
        size="sm"
        disabled={busy}
        onClick={() => onAction("completed", "Complete rental")}
      >
        Complete
      </Button>
    );
  }

  return (
    <span className="text-[10px] text-muted-foreground">No action</span>
  );
}

function SummaryChip({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "violet" | "sky" | "emerald" | "rose";
}) {
  const tones = {
    violet: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300",
    sky: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300",
    emerald:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
    rose: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300",
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

function BookingDetails({ booking }: { booking: Booking }) {
  const rows = [
    ["Booking ID", booking.bookingId],
    ["Equipment", booking.equipmentName],
    ["Customer", `${booking.customerName} (${booking.customerEmail})`],
    ["Owner", `${booking.ownerName} (${booking.ownerEmail})`],
    ["Rental start", formatDate(booking.rentalStartDate)],
    ["Rental end", formatDate(booking.rentalEndDate)],
    ["Duration", `${booking.duration} day(s)`],
    ["Quantity", String(booking.requiredQuantity)],
    ["Price per unit", formatCurrency(booking.pricePerUnit)],
    ["Total amount", formatCurrency(booking.totalAmount)],
    ["Contact number", booking.contactNumber || "—"],
    ["Delivery address", booking.deliveryAddress || "—"],
    ["Additional notes", booking.additionalNotes || "—"],
    ["Booked at", formatDateTime(booking.bookingDate)],
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <StatusBadge status={booking.bookingStatus} />
        <StatusBadge status={booking.paymentStatus} />
      </div>

      <dl className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border/70">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="grid grid-cols-1 gap-1 px-3.5 py-2.5 text-xs sm:grid-cols-[150px_1fr] sm:gap-3"
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
    </div>
  );
}
