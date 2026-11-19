import Link from "next/link";
import { ArrowRight, ClipboardList } from "lucide-react";

import { EmptyState } from "@/components/dashboard/EmptyState";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Booking, UserRole } from "@/types/dashboard";

export function RecentBookingsTable({
  bookings,
  role,
  compact = true,
}: {
  bookings: Booking[];
  role: UserRole;
  compact?: boolean;
}) {
  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="No rentals yet"
        description={
          role === "customer"
            ? "Your rental requests will appear here once you book equipment."
            : "Booking activity will appear here as soon as requests arrive."
        }
        compact
      />
    );
  }

  return (
    <div className="-mx-1 overflow-x-auto pb-1">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <thead>
          <tr className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            <th className="px-1 pb-3 font-semibold">Equipment</th>
            {role !== "customer" && (
              <th className="px-1 pb-3 font-semibold">Customer</th>
            )}
            {role === "admin" && (
              <th className="px-1 pb-3 font-semibold">Owner</th>
            )}
            <th className="px-1 pb-3 font-semibold">Dates</th>
            <th className="px-1 pb-3 font-semibold">Amount</th>
            <th className="px-1 pb-3 text-right font-semibold">
              Status
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border/60">
          {bookings.map((booking) => (
            <tr
              key={booking._id}
              className="text-xs text-muted-foreground transition hover:bg-muted/40"
            >
              <td className="px-1 py-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <ClipboardList className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="max-w-[160px] truncate font-semibold text-foreground">
                      {booking.equipmentName}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {booking.bookingId}
                    </p>
                  </div>
                </div>
              </td>

              {role !== "customer" && (
                <td className="max-w-[130px] truncate px-1 py-3">
                  {booking.customerName}
                </td>
              )}

              {role === "admin" && (
                <td className="max-w-[130px] truncate px-1 py-3">
                  {booking.ownerName}
                </td>
              )}

              <td className="whitespace-nowrap px-1 py-3">
                {formatDate(booking.rentalStartDate)}
                <span className="mx-1 text-muted-foreground/50">→</span>
                {formatDate(booking.rentalEndDate)}
              </td>

              <td className="whitespace-nowrap px-1 py-3 font-semibold text-foreground">
                {formatCurrency(booking.totalAmount)}
              </td>

              <td className="px-1 py-3 text-right">
                <StatusBadge status={booking.bookingStatus} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {compact && (
        <div className="mt-3 flex justify-end">
          <Link
            href="/dashboard/rentals"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
          >
            View all rentals
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}
    </div>
  );
}
