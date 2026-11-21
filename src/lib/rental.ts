/**
 * Shared rental pricing helpers.
 *
 * The same logic is used on the equipment details page and the checkout
 * page so the price shown to the customer always matches the price sent
 * to the server. The server recalculates the amount again before creating
 * a Stripe session, so this is display-only.
 */

export type RentalType = "hourly" | "daily" | "weekly" | "monthly" | string;

export function getTodayDateInputValue(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Number of billable rental units between two dates.
 * Daily rentals count inclusive days. Weekly and monthly rentals round up.
 * Hourly rentals assume an 8-hour rental day.
 */
export function calculateRentalUnits(
  startDateStr: string,
  endDateStr: string,
  rentalType?: RentalType
): number {
  if (!startDateStr || !endDateStr) return 1;

  const start = new Date(`${startDateStr}T00:00:00`);
  const end = new Date(`${endDateStr}T00:00:00`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 1;
  }

  const diffMs = Math.max(0, end.getTime() - start.getTime());
  const diffDays = Math.max(
    1,
    Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1
  );

  switch ((rentalType || "daily").toLowerCase()) {
    case "hourly":
      return diffDays * 8;
    case "weekly":
      return Math.max(1, Math.ceil(diffDays / 7));
    case "monthly":
      return Math.max(1, Math.ceil(diffDays / 30));
    case "daily":
    default:
      return diffDays;
  }
}

export function formatMoney(value: number, currency = "USD"): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value || 0);
  } catch {
    return `$${Number(value || 0).toLocaleString()}`;
  }
}

export function formatRentalDate(value?: string): string {
  if (!value) return "—";

  const date = new Date(
    value.length <= 10 ? `${value}T00:00:00` : value
  );

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
