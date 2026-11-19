export const CATEGORY_OPTIONS = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles",
  "Agriculture",
  "Electronics",
  "Events",
];

export const CONDITION_OPTIONS = [
  "Excellent",
  "Good",
  "Fair",
  "Needs Maintenance",
];

export const RENTAL_TYPE_OPTIONS = [
  "hourly",
  "daily",
  "weekly",
  "monthly",
];

export const EQUIPMENT_STATUS_OPTIONS = [
  { label: "All statuses", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export const CATEGORY_FILTER_OPTIONS = [
  { label: "All categories", value: "" },
  ...CATEGORY_OPTIONS.map((category) => ({
    label: category,
    value: category,
  })),
];
